import { Component, OnInit, OnDestroy, signal, effect, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  query,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './book-table.html', 
  styleUrls: ['./book-table.css']
})
export class Book implements OnInit, OnDestroy {
 
  private firebaseConfig = {
    apiKey: "AIzaSyDCamwZvaJE_OonbfBvIWmQylRg_9WmR2w",
    authDomain: "everrest-booking.firebaseapp.com",
    projectId: "everrest-booking",
    storageBucket: "everrest-booking.firebasestorage.app",
    messagingSenderId: "336330371972",
    appId: "1:336330371972:web:87204355dff003fb31e3d1",
    measurementId: "G-7X2JT99CR3"
  };

  private app!: FirebaseApp;
  private db!: Firestore;
  private unsubFirestore: any;
  private appId = "everrest-booking";
  private EVERREST_API = "https://api.everrest.educata.dev";

  // --- SIGNALS ---
  token = signal<string | null>(localStorage.getItem("token"));
  userId = signal<string | null>(this.extractUserId(localStorage.getItem("token")));
  view = signal<'signin' | 'signup'>('signin');
  bookings = signal<any[]>([]);
  loading = signal(false);
  status = signal<string | null>(null);
  editingId = signal<string | null>(null);
  
  // NEW: Tab control for the right-side container
  activeTab = signal<'form' | 'history'>('form');

  // --- FORMS ---
  authForm = { email: "", password: "", firstName: "", lastName: "" };
  bookingForm = { name: "", guests: 2, date: "", time: "" };
  editForm = { name: "", guests: 2, date: "", time: "" };

  constructor(private ngZone: NgZone) {
    // Sync Firestore listener when user changes
    effect(() => {
      const uid = this.userId();
      if (uid && this.db) this.listenBookings(uid);
    });
  }

  ngOnInit() {
    this.app = initializeApp(this.firebaseConfig);
    this.db = getFirestore(this.app);

    const uid = this.userId();
    if (uid) this.listenBookings(uid);
  }

  ngOnDestroy() {
    if (this.unsubFirestore) this.unsubFirestore();
  }

  // --- TAB SWITCHING ---
  setTab(tab: 'form' | 'history') {
    this.activeTab.set(tab);
    this.editingId.set(null); // Close any open edit states
  }

  // --- JWT HELPER ---
  private extractUserId(token: string | null): string | null {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.id || payload.email;
    } catch {
      return null;
    }
  }

  // --- FIREBASE LISTENERS ---
  private listenBookings(uid: string) {
    if (this.unsubFirestore) this.unsubFirestore();

    const bookingsCol = collection(this.db, `artifacts/${this.appId}/users/${uid}/reservations`);
    const q = query(bookingsCol);

    this.unsubFirestore = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a: any, b: any) => b.timestamp - a.timestamp);
      this.ngZone.run(() => this.bookings.set(data));
    });
  }

  // --- AUTH ACTIONS ---
  async handleSignUp(e: Event) {
    e.preventDefault();
    this.loading.set(true);
    try {
      const res = await fetch(`${this.EVERREST_API}/auth/sign_up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: this.authForm.firstName,
          lastName: this.authForm.lastName,
          age: 25,
          email: this.authForm.email,
          password: this.authForm.password,
          address: "Tbilisi",
          phone: "+995555555555",
          zipcode: "0101",
          avatar: "https://i.pravatar.cc/150",
          gender: "MALE"
        })
      });
      if (!res.ok) throw new Error("Signup failed");
      this.showStatus("Account created");
      this.view.set("signin");
    } catch (err: any) {
      alert(err.message);
    } finally { this.loading.set(false); }
  }

  async handleSignIn(e: Event) {
    e.preventDefault();
    this.loading.set(true);
    try {
      const res = await fetch(`${this.EVERREST_API}/auth/sign_in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.authForm.email, password: this.authForm.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const token = data.access_token;
      localStorage.setItem("token", token);
      this.token.set(token);
      this.userId.set(this.extractUserId(token));
      this.showStatus("Welcome back!");
    } catch (err: any) {
      alert(err.message);
    } finally { this.loading.set(false); }
  }

  logout() {
    localStorage.removeItem("token");
    this.token.set(null);
    this.userId.set(null);
    this.bookings.set([]);
  }

  // --- BOOKING CRUD ---
  async saveBooking(e: Event) {
    e.preventDefault();
    const uid = this.userId();
    if (!uid) return;
    this.loading.set(true);

    try {
      const userDocRef = doc(this.db, `artifacts/${this.appId}/users/${uid}`);
      await setDoc(userDocRef, { createdAt: Date.now() }, { merge: true });

      await addDoc(collection(this.db, `artifacts/${this.appId}/users/${uid}/reservations`), {
        name: this.bookingForm.name,
        guests: parseInt(this.bookingForm.guests as any, 10),
        date: this.bookingForm.date,
        time: this.bookingForm.time,
        timestamp: Date.now()
      });

      this.bookingForm = { name: "", guests: 2, date: "", time: "" };
      this.showStatus("Table ordered successfully!");
      this.setTab('history'); // Automatically switch to see the new booking
    } catch (err: any) {
      alert(err.message);
    } finally { this.loading.set(false); }
  }

  async deleteBooking(id: string) {
    const uid = this.userId();
    if (!uid || !confirm('Cancel this reservation?')) return;
    await deleteDoc(doc(this.db, `artifacts/${this.appId}/users/${uid}/reservations/${id}`));
    this.showStatus("Reservation removed");
  }

  startEdit(item: any) {
    this.editingId.set(item.id);
    this.editForm = { 
      name: item.name, 
      guests: item.guests, 
      date: item.date, 
      time: item.time 
    };
  }

  async updateBooking(id: string) {
    const uid = this.userId();
    if (!uid) return;
    try {
      await updateDoc(doc(this.db, `artifacts/${this.appId}/users/${uid}/reservations/${id}`), {
        name: this.editForm.name,
        guests: parseInt(this.editForm.guests as any, 10),
        date: this.editForm.date,
        time: this.editForm.time
      });
      this.editingId.set(null);
      this.showStatus("Booking updated");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  }

  // --- UI HELPERS ---
  private showStatus(msg: string) {
    this.status.set(msg);
    setTimeout(() => this.status.set(null), 3000);
  }
}
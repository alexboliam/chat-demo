import { computed, inject, Injectable, signal } from '@angular/core';

import { Message } from '../interfaces/message';
import { FIRESTORE } from '../../app.config';
import { addDoc, collection, limit, orderBy, query } from 'firebase/firestore';

import { collectionData } from 'rxfire/firestore';
import { catchError, exhaustMap, ignoreElements, map } from 'rxjs/operators';
import { connect } from 'ngxtension/connect';
import { defer, merge, Observable, of, Subject } from 'rxjs';

interface MessageState {
  messages: Message[],
  error: string | null,
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private firestore = inject(FIRESTORE);

  // sources
  messages$ = this.getMessages();
  add$ = new Subject<Message['content']>();

  // state
  private state = signal<MessageState>({
    messages: [],
    error: null,
  });

  // selectors
  messages = computed(() => this.state().messages);
  error = computed(() => this.state().error);

  constructor() {
    // reducers
    const nextState$ = merge(
      this.messages$.pipe(map((messages) => ({ messages }))),
      this.add$.pipe(
        exhaustMap((message) => this.addMessage(message)),
        ignoreElements(),
        catchError((error) => of({ error }))
      )
    );

    connect(this.state).with(nextState$);
  }

  private getMessages() {
    const messagesCollection = query(
      collection(this.firestore, 'messages'),
      orderBy('created', 'desc'),
      limit(50)
    );

    return collectionData(messagesCollection, { idField: 'id' }).pipe(
      map((messages) => [...messages].reverse())
    ) as Observable<Message[]>;
  }

  private addMessage(message: string) {
    const newMessage: Message = {
      author: 'me@mytest.com',
      content: message,
      created: Date.now().toString(),
    }

    const messagesCollection = collection(this.firestore, 'messages');

    return defer(() => addDoc(messagesCollection, newMessage));
  }
}

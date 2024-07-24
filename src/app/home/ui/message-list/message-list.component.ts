import { Component, input } from '@angular/core';
import { Message } from '@shared/interfaces/message';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.less'
})
export class MessageListComponent {
  messages = input.required<Message[]>();
}

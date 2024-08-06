import { Component, inject } from '@angular/core';
import { MessageListComponent } from "./ui/message-list/message-list.component";
import { MessageService } from '@shared/data-access/message.service';
import { MessageInputComponent } from "./ui/message-input/message-input.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MessageListComponent, MessageInputComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export default class HomeComponent {
  messageService = inject(MessageService);
}

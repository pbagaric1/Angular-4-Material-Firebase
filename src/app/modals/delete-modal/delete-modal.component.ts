import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {

  ngOnInit() {
  }

  constructor(public dialogRef: MatDialogRef<DeleteModalComponent>, public taskService: TaskService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  delete(): void {
   // this.taskService.deleteTask(this.data.key);
  }

}

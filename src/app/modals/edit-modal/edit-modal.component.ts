import { TaskService } from './../../services/task.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent {

  constructor(public dialogRef: MatDialogRef<EditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public taskService: TaskService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  edit(): void {
    this.taskService.updateTask(this.data);
  }

}

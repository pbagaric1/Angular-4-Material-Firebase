import { TaskService } from './../../services/task.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Task } from '../../models/task.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.css']
})
export class AddModalComponent implements OnInit {

  task = {
    key: '',
    id: '',
    name: '',
    description: '',
    timeOfCreation: ''
  }

  ngOnInit() {
  }

  constructor(public dialogRef: MatDialogRef<AddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    public taskService: TaskService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public add() {
    this.taskService.addTask(this.task)
  }

}

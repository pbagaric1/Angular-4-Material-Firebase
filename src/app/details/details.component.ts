import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { EditModalComponent } from '../modals/edit-modal/edit-modal.component';
import { MatDialog } from '@angular/material';
import { DeleteModalComponent } from '../modals/delete-modal/delete-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  task : any;

  constructor(public dialog: MatDialog, public taskService: TaskService,
              public router: Router) { }

  ngOnInit() {
    this.taskService.currentTask.subscribe(task => this.task = task);
    console.log(this.task);
  }

  editTask() {
    const dialogRef = this.dialog.open(EditModalComponent, {
      data: { key: this.task.key, id: this.task.data.id, name: this.task.data.name,
         description: this.task.data.description, timeOfCreation: this.task.data.timeOfCreation }
    });
  }

  
  deleteTask() {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
          this.taskService.deleteTask(this.task.key);
          this.router.navigate(['/dashboard']);
        }
      })
    }

}

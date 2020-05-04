import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DoorBoardListComponent } from './doorBoard/doorBoard-list.component';
import { AddDoorBoardComponent } from './doorBoard/add-doorBoard.component';
import { DoorBoardPageComponent } from './doorBoard/doorBoard-page.component';
import { EditNoteComponent } from './notes/edit-note.component';
import { AddNoteComponent } from './notes/add-note.component';
import { DoorBoardComponent} from './your-doorBoard/your-doorBoard.component';
import { ViewerComponent } from './viewer/viewer.component';
import { AuthGuard } from './auth/auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './auth/interceptor.service';
import { FavoriteComponent } from './favorite/favorite.component';
import { RepostNoteComponent } from './favorite/repost.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'doorBoards', component: DoorBoardListComponent},
  {path: 'doorBoards/new', component: AddDoorBoardComponent, canActivate: [AuthGuard]},
  {path: 'doorBoards/:id', component: DoorBoardPageComponent},
  {path: 'doorBoard/:id/notes/new', component: AddNoteComponent},
  {path: 'notes/new', component: AddNoteComponent},
  {path: 'notes', component: DoorBoardPageComponent},
  {path: 'notes/new', component: AddNoteComponent},
  // {path: ':id/edit', component: EditNoteComponent},
  // {path: 'edit/:id', component: EditNoteComponent, canActivate: [AuthGuard]},
  {path: 'notes/edit/:id', component: EditNoteComponent, canActivate: [AuthGuard]},
  {path: 'your-doorBoard', component: DoorBoardComponent, canActivate: [AuthGuard]},
  {path: 'doorBoards/:id/viewer', component: ViewerComponent},
  {path: 'doorBoards/:id/favorite', component: FavoriteComponent},
  {path: 'notes/repost/:id', component: RepostNoteComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true
  }]
})
export class AppRoutingModule {


 }

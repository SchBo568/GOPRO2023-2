import { Routes } from '@angular/router';
import { UserDetailsComponent } from './user-details/user-details.component';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './register/register.component';
import { AddToolComponent } from './add-tool/add-tool.component';
import { MyToolsComponent } from './my-tools/my-tools.component';

export const routes: Routes = [
    //{path: '', component: HeaderComponent},
    {path: 'user-details', component: UserDetailsComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'add-tool', component: AddToolComponent},
    {path: 'my-tools', component: MyToolsComponent}
];
import { NgModule }          from '@angular/core';
import { RouterModule }      from '@angular/router';
import { BrowserModule }     from '@angular/platform-browser';

import { BlookRoutesModule } from './Blook.routes.module';

/**
 * Our Modules
 */
import { AuthModule }        from '../AuthModule/Auth.module';
import { DashboardModule }   from '../DashboardModule/Dashboard.module';
import { GeoModule }         from '../GeoModule/Geo.module';
import { RegionsModule }     from '../RegionsModule/Regions.module';
import { PlacesModule }      from '../PlacesModule/Places.module';
import { CategoriesModule }  from '../CategoriesModule/Categories.module';
import { AttendenceModule }  from '../AttendenceModule/Attendence.module';
import { MessagesModule }    from '../MessagesModule/Messages.module';
import { PositionsModule }   from '../PositionsModule/Positions.module';
import { SettingsModule }    from '../SettingsModule/Settings.module';
import { TerminalsModule }   from '../TerminalsModule/Terminals.module';
import { TodolistsModule }   from '../TodolistsModule/Todolists.module';
import { NotfoundModule }    from '../NotfoundModule/Notfound.module';

/**
 * Main Components that make Blook functional and start
 */
import { BlookComponent }     from './components/Blook.component';
import { SidebarComponent }   from './components/Sidebar.component';
import { HeaderComponent }    from './components/Header.component';


@NgModule({
    imports: [
        BrowserModule,
        AuthModule,
        DashboardModule,
        GeoModule,
        RegionsModule,
        PlacesModule,
        CategoriesModule,
        AttendenceModule,
        MessagesModule,
        PositionsModule,
        SettingsModule,
        TerminalsModule,
        TodolistsModule,
        NotfoundModule,
        BlookRoutesModule
    ],
    declarations: [
        BlookComponent,
        SidebarComponent,
        HeaderComponent
    ],
    providers: [],
    bootstrap: [BlookComponent]
})
export class BlookModule { }

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PlanPage } from '../pages/plan/plan';
import { DataProvider } from '../providers/data/data';
import { DummyData } from '../providers/data/dummyData';
import { CreatePlanPopupPage } from '../pages/popups/create_plan/create-plan';
import { CreateItemPopupPage } from '../pages/popups/create_item/create-item';
import { ItemLongActionPage } from '../pages/popups/item_long_action/item-long-action';
import { FormsModule } from "@angular/forms";
import { SQLite } from "@ionic-native/sqlite";
import { StoredData } from "../providers/data/storedData";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PlanPage,
    CreatePlanPopupPage,
    CreateItemPopupPage,
    ItemLongActionPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp), 
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PlanPage,
    CreatePlanPopupPage,
    CreateItemPopupPage,
    ItemLongActionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    DummyData,
    SQLite,
    StoredData
  ]
})
export class AppModule {}

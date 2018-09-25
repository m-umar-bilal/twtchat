import { Component } from '@angular/core';

import { SettingsPage } from '../settings/settings';
import { FriendsPage } from '../friends/friends';
import { StatusPage } from '../status/status';
import { GroupsPage } from '../groups/groups';
import { ChatPage } from '../chat/chat';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ChatPage;
  tab2Root = GroupsPage;
  tab3Root = StatusPage;
  tab4Root = FriendsPage;
  tab5Root = SettingsPage;

  constructor() {

  }
}

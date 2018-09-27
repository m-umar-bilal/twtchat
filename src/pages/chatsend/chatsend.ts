import {Component, ElementRef, ViewChild} from '@angular/core';
import {Content, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ContactInfoPage} from '../contact-info/contact-info';
import {ChatMessage, ChatService, UserInfo} from "../../providers/chat-service";
import {environment} from "../../env";
import {RestService} from "../../services";

@IonicPage()
@Component({
  selector: 'page-chatsend',
  templateUrl: 'chatsend.html',
})
export class ChatsendPage {


  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  msgList: ChatMessage[] = [];
  user: UserInfo;
  toUser: UserInfo;
  editorMsg = '';
  showEmojiPicker = false;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;
  public groupData: any;
  public messages: any;


  constructor(public navParams: NavParams, public navCtrl: NavController,
              private chatService: ChatService,
              private events: Events, private svc: RestService) {
    // Get the navParams toUserId parameter
    console.log(navParams)
    this.groupData = navParams.data;

    this.messages = this.groupData.messages.reverse();
    this.toUser = {
      id: navParams.get('toUserId'),
      name: navParams.get('toUserName')
    };
    // Get mock user information
    this.chatService.getUserInfo()
      .then((res) => {
        this.user = res
      });

    events.subscribe('chat:updated', (chat, time) => {
      console.log(chat)
      // user and time are the same arguments passed in `events.publish(user, time)`


      chat.groups.filter(item => item.id === this.groupData.id)[0].messages.reverse().forEach((item) => {
        if (this.messages.filter(i => i.unique_code === item.unique_code).length === 0) {
          this.messages.push(item);
          this.scrollToBottom();

        }
      });
      console.log("updated");
    });
  }

  ionViewWillLeave() {
    // unsubscribe
    this.events.unsubscribe('chat:received');
  }

  ionViewDidEnter() {
    //get message list
    this.getMsg();

    // Subscribe to received  new message events
    this.events.subscribe('chat:received', msg => {
      this.pushNewMsg(msg);
    })
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  sendChat(message,obj) {

    this.svc.sendChat(this.currentUser.email, this.currentUser.password,this.currentUser.user_id,this.groupData.id,this.groupData.private,message,"text",obj)
      .subscribe((res: any) => {


          if (res.error_message === "") {
            // localStorage.setItem("UserData", JSON.stringify(res));
            // this.svc.userData = res;
            // console.log("yeh aaya");
            // console.log(res);
            this.scrollToBottom();

          } else {

          }
        },
        err => {
          console.log(err);

          if (err !== false) {
            // let toast = this.toastsAlertService.createToast(err);
            // toast.present();
          }
        })
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.focus();
    } else {
      this.setTextareaScroll();
    }
    this.content.resize();
    this.scrollToBottom();
  }

  /**
   * @name getMsg
   * @returns {Promise<ChatMessage[]>}
   */
  getMsg() {
    // Get mock message list
    return this.chatService
      .getMsgList()
      .subscribe(res => {
        this.msgList = res;
        this.scrollToBottom();
      });
  }

  /**
   * @name sendMsg
   */
  sendMsg() {
    if (!this.editorMsg.trim()) return;

    // Mock message
    const id = new Date();
    let arr = this.currentUser.photoProfil.split('profil');
    let newMsg = {


      create_date: id,
      directory: arr[0],
      message: this.editorMsg,
      mime: null,
      name: this.currentUser.name,
      name_file: null,
      photo_profil: "profil"+arr[1],
      type_message: "text",
      unique_code: (id).getTime()+""+this.currentUser.user_id+""+this.groupData.id+""+this.groupData.private,
      user_id: this.currentUser.user_id,
    };
    this.sendChat(this.editorMsg,newMsg.unique_code);

    this.messages.push(newMsg);
    this.editorMsg = '';
    this.scrollToBottom();

    if (!this.showEmojiPicker) {
      this.focus();
    }

    // this.chatService.sendMsg(newMsg)
    //   .then(() => {
    //     let index = this.getMsgIndexById(id);
    //     if (index !== -1) {
    //       this.msgList[index].status = 'success';
    //     }
    //   })
  }

  /**
   * @name pushNewMsg
   * @param msg
   */
  pushNewMsg(msg: ChatMessage) {
    const userId = this.user.id,
      toUserId = this.toUser.id;
    // Verify user relationships
    if (msg.userId === userId && msg.toUserId === toUserId) {
      this.msgList.push(msg);
    } else if (msg.toUserId === userId && msg.userId === toUserId) {
      this.msgList.push(msg);
    }
    this.scrollToBottom();
  }

  getMsgIndexById(id: string) {
    return this.msgList.findIndex(e => e.messageId === id)
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea = this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }

  contactinfo() {
    this.navCtrl.push("ContactInfoPage");
  }
}

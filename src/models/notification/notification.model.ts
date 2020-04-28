import { ModelBase } from '../base/base.model'

class NotificationModel extends ModelBase {
  private last_modification: any;
  private id: any;
  private date_creation: any;
  private last_user_modification: any;
  private status: any;
  private date: any;
  private sender: any;
  private message: any;
  private receiver: any;
  private subject: any;
  private message_resume: any;
  private business_id: any;
  private folder: any;

  public folders:any = {
    inbox: { id: 1, name: 'inbox', title: 'SIDE_INBOX_OPTION', icon: 'mdi-email-outline' },
    sent: { id: 2, name: 'sent', title: 'SIDE_SENT_OPTION', icon: 'mdi-share' },
    junk: { id: 3, name: 'junk', title: 'SIDE_DRAFT_OPTION', icon: 'mdi-file-outline' },
    draft: { id: 4, name: 'draft', title: 'SIDE_TRASH_OPTION', icon: 'mdi-delete' }
  }

  public statuses:any = {
    read: { id: 1, name: 'read', title: 'Read' },
    unread: { id: 2, name: 'unread', title: 'Unread' },
    deleted: { id: 3, name: 'deleted', title: 'Deleted' },
    ignored: { id: 4, name: 'ignored', title: 'Ignored' }
  }

  public notification_types:any = {
    stored: { id: 1, name: 'stored', title: 'Stored' },
    push: { id: 2, name: 'push', title: 'Push' },
    email: { id: 3, name: 'email', title: 'Email' },
    allBasics: { id: 9999, name: 'allBasics', title: 'All basics' }
  }

  public email_templates:any = {
    confirmEmail: { id: 1, name: 'confirmEmail', title: 'Confirm email' },
    newsFeed: { id: 2, name: 'newsFeed', title: 'News feed' },
    warning: { id: 3, name: 'warning', title: 'Warning' },
    simple: { id: 4, name: 'simple', title: 'Simple' },
    danger: { id: 5, name: 'danger', title: 'Danger' },
    administrative: { id: 6, name: 'administrative', title: 'Administrative' }
  }

  constructor(args: any, dependencies: any) {
    super(dependencies)

    if (!args || !dependencies) {
      throw new Error('Required args to build this entity')
    }

    this.dependencies = dependencies

    /* const { name, level } = args */
    const timestamp = (new Date()).getTime() + ''

    /* Base */
    this.last_modification = { value: timestamp, type: dependencies.dal.types.timestamp }
    this.id = { value: args.id, type: dependencies.dal.types.bigserial, isPK: true }
    this.date_creation = { value: timestamp, type: dependencies.dal.types.timestamp }
    this.last_user_modification = { value: args.user_id, type: dependencies.dal.types.object }
    this.status = { value: args.status || this.statuses.active, type: dependencies.dal.types.object }

    /* Custom fields */
    this.date = { value: timestamp, type: dependencies.dal.types.timestamp }
    this.sender = { value: args.sender, type: dependencies.dal.types.string }
    this.message = { value: args.message, type: dependencies.dal.types.string }
    this.receiver = { value: args.receiver, type: dependencies.dal.types.string }
    this.subject = { value: args.subject, type: dependencies.dal.types.string }
    this.message_resume = { value: args.message_resume, type: dependencies.dal.types.string }
    this.business_id = { value: args.business_id, type: dependencies.dal.types.string }
    this.folder = { value: args.folder || this.folders.inbox, type: dependencies.dal.types.object }
  }

  // Return entity sanitized
  get sanitized () {
    return {
      id: this.id.value || this.id.type.default,
      status: this.status.value || this.status.type.default,
      date: this.date.value || this.date.type.default,
      message: this.message.value || this.message.type.default,
      receiver: this.receiver.value || this.receiver.type.default,
      subject: this.subject.value || this.subject.type.default,
      message_resume: this.message_resume.value || this.message_resume.type.default,
      sender: this.sender.value || this.sender.type.default,
      folder: this.folder.value || this.folder.type.default
    }
  }

  get () {
    return {
      id: this.id.value || this.id.type.default,
      date_creation: this.date_creation.value || this.date_creation.type.default,
      last_modification: this.last_modification.value || this.last_modification.type.default,
      last_user_modification: this.last_user_modification.value || this.last_user_modification.type.default,
      status: this.status.value || this.status.type.default,
      date: this.date.value || this.date.type.default,
      message: this.message.value || this.message.type.default,
      receiver: this.receiver.value || this.receiver.type.default,
      subject: this.subject.value || this.subject.type.default,
      message_resume: this.message_resume.value || this.message_resume.type.default,
      sender: this.sender.value || this.sender.type.default,
      folder: this.folder.value || this.folder.type.default
    }
  }
}

export { NotificationModel }

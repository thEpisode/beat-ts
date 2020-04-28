import { ModelBase } from '../base/base.model'

class TemplateModel extends ModelBase {
  private last_modification: any;
  private id: any;
  private date_creation: any;
  private last_user_modification: any;
  private status: any;
  private name: any;


  public statuses: any = {
    inactive: { id: 1, name: 'inactive', title: 'Inactive' },
    active: { id: 2, name: 'active', title: 'Active' },
    deleted: { id: 3, name: 'deleted', title: 'Deleted' }
  }

  constructor(args: any, dependencies: any) {
    super(dependencies)

    if (!args || !dependencies) {
      throw new Error('Required args and dependencies to build this entity')
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
    this.name = { value: args.name, type: dependencies.dal.types.string }
  }

  // Return entity sanitized
  get sanitized () {
    return {
      id: this.id.value || this.id.type.default,
      name: this.name.value || this.name.type.default
    }
  }

  get () {
    return {
      id: this.id.value || this.id.type.default,
      date_creation: this.date_creation.value || this.date_creation.type.default,
      last_modification: this.last_modification.value || this.last_modification.type.default,
      last_user_modification: this.last_user_modification.value || this.last_user_modification.type.default,
      status: this.status.value || this.status.type.default,
      name: this.name.value || this.name.type.default
    }
  }
}

module.exports = TemplateModel

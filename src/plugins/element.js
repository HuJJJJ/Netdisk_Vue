import Vue from 'vue'

import {
    Container,
    Aside,
    Main,
    Button,
    Input,
    Popover,
    Message,
    Slider,
    Form,
    FormItem,
    TabPane,
    Tabs,
    Upload,
    Progress,
    Dialog,
    Image,
    Tooltip,
    Tree,
    Notification,
    Row,
    Col,
    Icon,
    DatePicker,
    Loading,
    PageHeader,
    Link
} from 'element-ui'

import ElementUI from 'element-ui'
//ElementUI.Dialog.props.closeOnClickModal.default = false

Vue.use(Container);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Button);
Vue.use(Input);
Vue.use(Popover);
Vue.use(Slider);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(TabPane);
Vue.use(Tabs);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Dialog);
Vue.use(Image);
Vue.use(Tooltip);
Vue.use(Tree);
Vue.use(Row);
Vue.use(Col);
Vue.use(Icon);
Vue.use(DatePicker);
Vue.use(PageHeader);
Vue.use(Link);
Vue.prototype.$message = Message
Vue.prototype.$notify = Notification;
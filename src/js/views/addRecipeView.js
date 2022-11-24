import icons from 'url:../../img/icons.svg';
import View from './View';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded! 🎉';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    //👆这个构造函数是为了让主javascript一运行的时候就运行这个子脚本中的_addHandlerShowWindow()这个function
    //这个运行方式和其他的就有点不一样
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
    //toggle是当classList有的时候就添加，没有的时候就删除，很适合做那种打开关上页面eventlistener
  }

  //👇这个addHandler一般都是拿来做和addEventListener有关的事情的
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener(
      'click',
      this.toggleWindow.bind(this)

      //👆inside of addeventlistener中，如果使用this关键词，this关键词就是这个addeventlistener绑上去的那个按钮，一般使用bind来重新定义
      //上面一行如果不换绑定this关键词的话，addEventListener里面的this.toggleWindow里面的this就会指向_btnOpen这个按钮，而不是一整个。
    );
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      //👆这个时候this函数指向upload那个按钮，把它展开就能得到所有的数值
      const data = Object.fromEntries(dataArr);
      //👆dataArr被Object.fromEntries处理成一个对象，他本来只是一堆arr的集合
      handler(data);
    });
  }

  //每一个向用户呈现内容的视图都需要一个generateMarkup
  _generateMarkup() {}
}

export default new AddRecipeView();

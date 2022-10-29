import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    //在一开始就检查有没有数据，并且还要检查是不是一个空的数组（也就是检查有没有

    this._data = data;
    //为了储存传过来的data
    const markup = this._generateMarkup();
    this._clear();
    //在插入新的内容之前，需要把之前的内容清除
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
    //这样可以把这部分变得reusable
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div> 
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //设置一个默认数值👇
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
      </div> 
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //因为输出的总是新的，所以这个this每次可以在不同的地方被定义，这个this._message也可以不一样
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
      </div> 
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

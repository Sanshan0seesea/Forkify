import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    //在一开始就检查有没有数据，并且还要检查是不是一个空的数组（也就是检查有没有

    this._data = data;
    //为了储存传过来的data
    const markup = this._generateMarkup();

    if (!render) return markup;
    //👆之所以到这里才return markup是因为只要return了markup，数据就会变成字符串，就传不了数据了，所以要先传好数据，再return一个字符串回去

    this._clear();
    //在插入新的内容之前，需要把之前的内容清除
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
    //👆这个_parent是哪里来的啊
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();
    //在一开始就检查有没有数据，并且还要检查是不是一个空的数组（也就是检查有没有
    //👆这在update中不需要

    this._data = data;
    //为了储存传过来的data

    //这个update要做的事情就是比较DOM元素，然后只更新不一样的部分。
    //需要使用到一些技巧，这个技巧就是把markup字符转成内存中的dom对象，然后用它来和实际的DOM进行比较
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    //👆构建了一个虚拟的DOM，不存在页面上，只存在我们的内存中（memory
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));
      //isEqualNode可以比较每个节点的内容是否是相同
      //在高级DOM部分的开头有很好地介绍了节点和元素之间的区别

      //👇updates changed TEXT（说这部分是最难懂的）
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild &&
        //👇因为下面会报错，所以直接在上面加一行
        newEl.firstChild.nodeValue.trim() !== ''
        //👆要找出那个最小的，有内容的元素，而不是整个盒子，否则会把整个盒子替换成纯文本的
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());

        curEl.textContent = newEl.textContent;
      }

      //updates changed Attributes（说这部分是最难懂的）

      if (!newEl.isEqualNode(curEl)) {
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(att =>
          curEl.setAttribute(att.name, att.value)
        );
        //👆把newEl全部设置成（setAttribute）curEl的值
      }
    });
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

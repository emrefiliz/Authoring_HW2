(function() {
  var time = new Date();

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const socket = io(); // a constant is a variable that should never change (remains constant)

  let messageList = document.querySelector('ul'),
    chatForm = document.querySelector('form'),
    nameInput = document.querySelector('.nickname'),
    nickName = null,
    chatMessage = chatForm.querySelector('.message');

  function setNickname() {
    nickName = this.value;
    $('#nickname-container').hide();
    $('#chat-container').show();
    socket.emit('chat message', capitalize(nickName) + ' has joined the channel.');
  }

  function handleSendMessage(e) {
    e.preventDefault(); // kill form submit
    nickName = (nickName && nickName.length > 0) ? nickName : 'user';
    msg = `<p id="nicknameArea">${capitalize(nickName)} <small>${time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</small></p><p id="messageArea">${chatMessage.value}</p>`;

    socket.emit('chat message', msg);
    chatMessage.value = '';
    return false;
  }

  function appendMessage(msg) {
    // will it get passed thru?
    debugger;
    let newMsg = `<li>${msg.message}</li>`
    messageList.innerHTML += newMsg;
  }

  function appendDMessage(msg) {
    let newMsg = `<li>${msg}</li>`
    messageList.innerHTML += newMsg;
  }

  nameInput.addEventListener('change', setNickname, false);
  chatForm.addEventListener('submit', handleSendMessage, false);
  socket.addEventListener('chat message', appendMessage, false);
  socket.addEventListener('disconnect message', appendDMessage, false);
})();

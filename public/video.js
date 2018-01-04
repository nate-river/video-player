const socket = io('http://localhost:3000');
socket.on('refresh', () => location.reload())

// 音量控制组件
class VolumeController {
  constructor() {
    this.render();
    // $('#VolumeController').on('click', this.handleClick);
    // $('#indicator').on('mousedown', this.handleMouseDown)
    // $(document).on('mouseup', this.handleMouseUp)
    // $('#video').eq(0).on('volumechange', this.handleVolumeChange)
  }
  handleClick() {
    // set volume
    alert(1);
  }
  handleVolumeChange() {
    // ui change
  }
  handleMouseDown(e) {
    e.stopPropagation();
    // set volume
    document.onmousemove = () => {
    }
  }
  handleMouseUp(e) {
    document.onmousemove = null
  }
  render() {
    // let el = `
    //   <div id="VolumeController">
    //     <div id="v-current"></div>
    //     <div id="indicator"></div>
    //   </div>
    // `;
    let el = `
    <div id="volume"></div>
    `
    $(el).appendTo('#video-controller')
  }
}
// 播放暂停控制组件
class PlayPauseController {
  constructor() {
    this.render();
    $('#play-pause').on('click', this.togglePlay);
    $('#video').eq(0).on('play', this.onplay);
    $('#video').eq(0).on('pause', this.onpause);
  }
  onplay() {
    $('#play-pause').addClass('active')
  }
  onpause() {
    $('#play-pause').removeClass('active')
  }
  togglePlay() {
    let video = $('#video').get(0);
    if (video.paused) {
      video.play()
    } else {
      video.pause();
    }
  }
  render() {
    let el = `<div id="play-pause"></div><div id="cart"></div>`
    $(el).appendTo('#video-controller');
  }
}
// 播放速率控制组件
class SpeedController {
  constructor() {
    this.render()
    $('#speed-ul').on('click', 'li', this.handleClick)
  }
  handleClick(e) {
    let speed = parseFloat($(this).html())
    $('#video').get(0).playbackRate = speed;
  }
  render() {
    let el = `
      <div id="speed-controller">
        <span>倍速</span>
        <ul id="speed-ul">
          <li>1.0</li>
          <li>1.5</li>
          <li>2.0</li>
          <li>2.5</li>
        </ul>
      </div>
    `
    $(el).appendTo('#video-controller');
  }
}
// 收藏控制组件
class FavController {
  constructor() {
    this.render()
  }
  handleClick() {
    // set loop type 
  }
  render() {
    let el = `
      <div id="fav"></div> `
    $(el).appendTo('#video-controller');
  }
}
// 清晰度控制组件
class ClarityController {
  constructor() {
    this.clarityList = 240;
    this.render()
    this.root = $('#ClarityController')
    this.root.on('mousedown', 'span', (e) => e.preventDefault());
    this.root.on('click', 'span', () => this.handleClick());
    this.root.find('ul').on('click', 'li', this.handleChange);
  }
  handleChange() {
    $('#ClarityController').find('ul li').removeClass('active')
    $(this).addClass('active');
  }
  handleClick() {
    this.root.find('ul').toggle()
  }
  render() {
    let el = `
      <div id="ClarityController">
        <span>清晰度</span>
        <ul>
          <li>240P</li>
          <li>480P</li>
          <li>720P</li>
          <li class="active">1080P</li>
        </ul>
      </div>
    `
    $(el).appendTo('#video-controller');
  }
}
// 弹幕显示组件
class BarrageDisplayController {
  constructor() {
    this.list = [
      { id: 1, content: '666' },
      { id: 2, content: '6666' },
      { id: 3, content: '66666' },
    ]
    this.render();
    socket.on('server-push', (data) => {
      $(`<li>${data.content}</li>`).css({
        top: Math.ceil(Math.random() * 300),
        left: 960 + Math.ceil(Math.random() * 250)
      }).appendTo('#BarrageController ul');
    })
  }
  render() {
    let el = `
      <div id="BarrageController">
        <ul>
          ${this.list.map(v => `<li>${v.content}</li>`).join('')}
        </ul>  
      </div>
    `
    $(el).appendTo('#video-box');
    $('#BarrageController li').each((i, v) => {
      $(v).css({
        top: Math.ceil(Math.random() * 300),
        left: 960 + Math.ceil(Math.random() * 250)
      })
    })
  }
}
// 弹幕发送组件
class BarrageSendController {
  constructor() {
    this.render();
    $('#send').on('click', this.send);
  }
  send() {
    let v = $('#barrage').val();
    socket.emit('message', { id: 1, content: v })
  }
  render() {
    let el = `
      <input type="text"/ id="barrage"> 
      <button id="send">发送</button>  
    `;
    $(el).appendTo('#video-controller');
  }
}
// 播放进度控制组件
class ProgressController {

  constructor() {
    this.render();
    this.video = $("#video").get(0);
    this.video.addEventListener('timeupdate', () => this.handleTimeUpdate())
    $('#progress-controller').on('click', this.handleClick);
  }
  formatetime(s) {
    if (isNaN(s)) return '--:--';
    s = Math.round(s);
    var mi = parseInt(s / 60); var se = s % 60;
    mi = mi < 10 ? '0' + mi : mi;
    se = se < 10 ? '0' + se : se;
    return mi + ':' + se;
  };

  handleTimeUpdate() {
    let width = this.video.currentTime / this.video.duration * 100 + '%';
    $('#progress-controller .p-current').css('width', width);
    $('#time-lable').html(this.formatetime(this.video.currentTime)+'/'+this.formatetime(this.video.duration))
  }
  handleClick(e) {
    let video = $('#video').get(0);
    video.currentTime = video.duration * e.offsetX / $(this).width();
  }
  render() {
    let el = `
      <div id="progress-controller">
        <div class="p-current">
          <div class="indicator"></div>
        </div>
      </div>
      <div id="time-lable">
        00:20/03:00
      </div>
    `;
    $(el).appendTo('#video-controller')
  }
}
// 全屏播放控制组件
class SizeController {
  constructor() {
    this.render();
    $('#full-screen').on('click', this.toggleFullScreen);
  }
  toggleFullScreen() {
    let videoElement = $('#video').get(0);
    if (!document.mozFullScreen && !document.webkitFullScreen) {
      if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen();
      } else {
        videoElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else {
        document.webkitCancelFullScreen();
      }
    }
  }
  render() {
    var el = `<div id="full-screen"></div>`;
    $(el).appendTo('#video-controller');
  }

}
// 播放和收藏列表控制组件
class PlayListController {
  constructor() {
    this.playList = [
      { id: 1, pic: '/img/1.png', title: 'a' },
      { id: 2, pic: '/img/2.png', title: 'b' },
      { id: 3, pic: '/img/3.png', title: 'c' },
    ]
    this.favList = [
      { id: 1, pic: '/img/1.png', title: 'a' },
      { id: 2, pic: '/img/2.png', title: 'b' }
    ]
    this.render();
  }
  render() {
    let el = `
      <div id="play-list">
        <div id="play-list-header"></div>
        <div id="play-list">
          <ul>
            ${this.playList.map(v => `<li>${v.title}</li>`).join('')}
          </ul>
        </div>
        <div id="fav-list">
          <ul>
            ${this.favList.map(v => `<li>${v.title}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    $(el).appendTo('#video-box');
  }
}

class VideoPlayer {
  constructor() {
    this.render();
  }
  render() {
    let el = `
      <div id="video-box">
        <video id="video" autoplay src="/video.mp4"></video>
        <div id="video-controller"></div>
      </div>
    `
    $(el).appendTo('#root');
    new PlayPauseController();
    new ProgressController();
    new ClarityController();
    new SpeedController();
    new FavController();
    new VolumeController();
    new SizeController();
    new BarrageDisplayController();
    // new BarrageSendController();
    new PlayListController();
  }
}
var player = new VideoPlayer();

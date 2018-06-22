<template>
  <div class="console">
    <p class="comment">{{user}}</p>
    <hr>
    <p>
      <label class="local" v-text="spanLabel"></label>
      <span v-if="showTypingAbout"><div class="cursor"></div></span>
      {{aboutMe}}
    </p>    
    <p v-if="showAboutValue">I have experience in developing software for over 10 years, I have a degree 
        in information systems from the University São Judas Tadeu. I act as a developer 
        analyst assisting in surveys of requirements, project architecture, full stack 
        development and leadership of .NET teams.</p>

    <!-- =========================================================================================== -->

    <p v-if="showContactLine">
      <label class="local" v-text="spanLabel"></label>
      <span v-if="showTypingContanct"><div class="cursor"></div></span>
      {{contact}}
    </p>
    <div v-if="showContactValue">
      <div class="item">
        <label>Email</label>
        <p><a href="maito:contato@lucianomeireles.io">contato@lucianomeireles.io</a></p>
      </div>
      <div class="item">
        <label>Linkedin</label>
        <p><a href="https://www.linkedin.com/in/lucianomeireles/">linkedin.com/in/lucianomeireles</a></p>
      </div>
      <br>
      <div class="item">
        <label>Github</label>
        <p><a href="https://github.com/lucianomeireles/">github.com/lucianomeireles</a></p>
      </div>
      <div class="item">
        <label>Skype</label>
        <p><a href="skype:luciano_smeireles?chat">luciano_smeireles</a></p>
      </div>
    </div>

    <!-- =========================================================================================== -->

    <!-- <p>
      <label class="local" v-text="spanLabel"></label>
      <span v-if="showTypingAbout"><div class="cursor"></div></span>
      {{aboutMe}}
    </p>    
    <p v-if="showAboutValue">I have experience in developing software for over 10 years, I have a degree 
        in information systems from the University São Judas Tadeu. I act as a developer 
        analyst assisting in surveys of requirements, project architecture, full stack 
        development and leadership of .NET teams.</p> -->
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      showTypingAbout: true,
      showAboutValue: false,     
      aboutMe: '',

      showContactLine: false,
      showTypingContanct: false,
      showContactValue: false,
      contact: '',
      // showAboutMe: false,
      
      // showContact: false,

      speedTyping: 120,
      enterSiteTime: null
    }
  },
  computed: {
    user() {
      let data = new Date()
      return `${data} -!- visitor [visitor@12.22.11.111] has joined #lucianomeireles.io`
    },
    time(){
      if(this.enterSiteTime)
        return `${this.enterSiteTime.getHours()}:${this.enterSiteTime.getMinutes()}`
    },
    spanLabel(){
      return `${this.time} <luciano>`
    }
  },
  created() {
    this.enterSiteTime = new Date()
    setTimeout(this.typeAboutMe, 1000)
  },
  methods: {
    typeAboutMe() {
      this.showTypingAbout = false
      let message = `about`
      if (this.aboutMe.length < message.length) {
        this.aboutMe += message.charAt(this.aboutMe.length)
        setTimeout(this.typeAboutMe, this.speedTyping)
      }
      else{
        setTimeout(() => {
          this.showAboutValue = true
          this.showContactLine = true
          this.showTypingContanct = true
          setTimeout(this.typeContact, 1000)
        }, 1000)
      }
    },

    typeContact() {
      this.showTypingContanct = false
      let message = `contact`
      if (this.contact.length < message.length) {
        this.contact += message.charAt(this.contact.length)
        setTimeout(this.typeContact, this.speedTyping)
      }
      else{
        setTimeout(() => {
          this.showContactValue = true
          // this.showContactLine = true
          // this.showTypingContanct = true
        }, 1000)
      }
    }
  }
}
</script>
<style scoped>
.console {
  max-width: 1000px;
  margin: 30px auto 0;
  padding: 0 15px;
  box-sizing: border-box;
}
.comment {
  color: #5d5c5d;
}
hr {
  border-style: dashed;
  margin: 20px 0;
}
.local {
  font-family: ASM-Bold;
  color: #47ff88;  
  display: inline;
}
.cursor{
  display: inline-block;
  background-color: #dcd9dc;
  width: 3px;
  height: 16px;
  vertical-align: middle;
  margin-left: 10px;

  animation-name: cursor;
  animation-duration: 1.5s;
}
.item{
  display: inline-block;
  margin-right: 50px;
  width: 240px;
  margin-bottom: 5px;
}
.item label{
  color: #426d8e;
}
.item p{
  margin: 5px 0;
}
.item a{
  color: #adadad;
  text-decoration: none;
  transition: all 100ms ease;
}
.item a:hover{
  color: #f5f5f5;
  text-decoration: underline;
}

@keyframes cursor {
    0%   {background-color: #cecdce;}
    25%  {background-color: transparent}
    50%   {background-color: #cecdce;}
    75%  {background-color: transparent}
    100%   {background-color: #cecdce;}
}
</style>


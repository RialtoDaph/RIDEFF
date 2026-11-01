// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RideffNana.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, useDC } from '@/lib/dc';
import { nanaEvent } from '@/lib/analytics';
import { startTextChat, startVoice, suggestsContact } from '@/components/nana/elevenlabs-client';


class Logic extends DCLogic {
  WA = '4917632572420';
  state = {
    open: false,
    mode: 'chat',
    msgs: this.greet(),
    typing: false,
    draft: '',
    call: 'idle',
    sec: 0,
    line: 0,
    muted: false,
    lv: 0,
    t0: 0,
    sum: null,
    editing: false,
    copied: false,
    mineOpen: false,
    mineSent: false,
    phone: ''
  };
  componentDidMount() {
    // One session per page load; Nana lives in the layout, so it survives navigation.
    this.sid = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2)).replace(/[^\w-]/g, '');
    this.onR = () => this.setState({
      vw: window.innerWidth
    });
    window.addEventListener('resize', this.onR);
    this.onR();
    this.alive = true;
    if (this.state.call !== 'idle' || this.state.mode !== 'chat') this.setState({
      call: 'idle',
      mode: 'chat',
      sec: 0,
      line: 0
    });
  }
  listRef = React.createRef();
  setList = el => {
    this.listEl = el;
    if (el) el.scrollTop = el.scrollHeight;
  };
  inputRef = React.createRef();
  CHIPS = {
    pricing: [this.props.t("RideffNana.whichPlanFitsMe"), this.props.t("RideffNana.whyASetupFee"), this.props.t("RideffNana.isVATIncluded")],
    work: [this.props.t("RideffNana.howWasTICBuilt"), this.props.t("RideffNana.canYouBuildMine"), this.props.t("RideffNana.howLongUntilLive")],
    life: [this.props.t("RideffNana.whatIsRIDEFFLife"), this.props.t("RideffNana.isTheTrialFree"), this.props.t("RideffNana.canMyFamilyUseIt")],
    contact: [this.props.t("RideffNana.howLongUntilLive"), this.props.t("RideffNana.whatDoesGrowthInclude"), this.props.t("RideffNana.bookACallWithRialto")],
    home: [this.props.t("RideffNana.whatDoesGrowthInclude"), this.props.t("RideffNana.howLongUntilLive"), this.props.t("RideffNana.bookACallWithRialto")]
  };
  A = [[/plan|fit/i, this.props.t("RideffNana.mostBusinessesStartWithGrowth249")], [/setup/i, this.props.t("RideffNana.theSetupPaysForAnalysisBuild"), 1], [/vat|tax|mwst/i, this.props.t("RideffNana.businessPricesAreNetPlus19")], [/tic/i, this.props.t("RideffNana.tICOriginalsGotAShopBuilt")], [/build|mine/i, this.props.t("RideffNana.yesItStartsWithAFree"), 1], [/long|live|timeline|when/i, this.props.t("RideffNana.threeStepsUnderstandBuildRunIt"), 1], [/family|together|people/i, this.props.t("RideffNana.togetherCoversUpTo4People")], [/trial|free/i, this.props.t("RideffNana.n14DaysFreeNoCardNeeded")], [/life/i, this.props.t("RideffNana.rIDEFFLifeIsAPersonalAssistant")], [/growth/i, this.props.t("RideffNana.growthConnectsCustomersSalesTeamAnd"), 1], [/call|book|talk|rialto/i, this.props.t("RideffNana.happyToSetThatUpPick"), 1]];
  SCRIPT = [['nana', this.props.t("RideffNana.hiThisIsNanaFromRIDEFF")], ['you', this.props.t("RideffNana.whatWouldASystemForMy")], ['nana', this.props.t("RideffNana.mostCafesStartWithGrowth249")], ['you', this.props.t("RideffNana.canITalkToRialtoAbout")], ['nana', this.props.t("RideffNana.ofCourseILlSendYou")]];
  page() {
    if (this.props.page) return this.props.page;
    const p = decodeURIComponent(location.pathname).toLowerCase();
    return p.includes('pricing') ? 'pricing' : p.includes('work') ? 'work' : p.includes('life') ? 'life' : p.includes('contact') ? 'contact' : 'home';
  }
  greet() {
    return [{
      from: 'bot',
      t: this.props.t("RideffNana.hiIMNanaAskMe"),
      choice: true
    }];
  }
  /** POST /api/nana/chat: streamed text, actions in the x-nana-actions header. */
  /**
   * Chat. With ElevenLabs configured, a text-only session with the Nana agent
   * (POST /api/nana/chat/session → signed URL); otherwise the mock route.
   */
  ask = async q => {
    q = (q || '').trim();
    if (!q || this.state.typing) return;
    this.setState(s => ({
      msgs: [...s.msgs, { from: 'me', t: q }],
      typing: true,
      draft: ''
    }));
    if (this.chatProvider !== 'mock') {
      try {
        const tc = await this.openChat();
        if (tc) {
          clearTimeout(this.rt);
          this.rt = setTimeout(() => this.chatFail(), 25000);
          tc.sendUserMessage(q);
          return;
        }
      } catch (e) {
        this.tc = null;
      }
    }
    return this.askMock(q);
  };
  chatFail = () => {
    clearTimeout(this.rt);
    this.setState(s => s.typing ? {
      typing: false,
      msgs: [...s.msgs, { from: 'bot', t: this.props.t(this.props.live ? "nana.sendFailed" : "RideffNana.iMStillAPreviewSo"), acts: true }]
    } : null);
  };
  /** Opens (or reuses) the text session; null in mock mode. */
  openChat = async () => {
    if (this.tc) return this.tc;
    if (this.tcOpening) return this.tcOpening;
    this.tcOpening = (async () => {
      const res = await fetch('/api/nana/chat/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId: this.sid })
      });
      const data = res.ok ? await res.json() : null;
      if (!data || data.provider !== 'elevenlabs') {
        this.chatProvider = 'mock';
        return null;
      }
      this.chatProvider = 'elevenlabs';
      const earlier = this.state.msgs.filter(m => (m.from === 'me' || m.from === 'bot') && !m.choice).slice(0, -1);
      const tc = await startTextChat({
        signedUrl: data.signedUrl,
        locale: this.props.locale,
        page: this.page(),
        onConnect: id => { this.tcId = id; },
        onReply: text => {
          clearTimeout(this.rt);
          if (!this.alive) return;
          this.setState(s => ({ typing: false, msgs: [...s.msgs, { from: 'bot', t: text, acts: suggestsContact(text) }] }));
        },
        onEnd: () => { this.tc = null; },
        onError: () => this.chatFail()
      });
      // A new session after a timeout: give the agent the earlier chat as context.
      if (earlier.length) tc.sendContextualUpdate(earlier.map(m => (m.from === 'me' ? 'User: ' : 'Nana: ') + m.t).join('\n'));
      this.tc = tc;
      return tc;
    })();
    try {
      return await this.tcOpening;
    } finally {
      this.tcOpening = null;
    }
  };
  /** Ends the text session (its post-call analysis then runs at ElevenLabs). */
  closeChat = async () => {
    const tc = this.tc;
    this.tc = null;
    if (tc) {
      try { await tc.endSession(); } catch (e) {}
    }
  };
  /** Mock mode: POST /api/nana/chat (streamed text, actions in x-nana-actions). */
  askMock = async q => {
    const history = [...this.state.msgs.filter(m => m.from === 'me' || (m.from === 'bot' && !m.choice))].map(m => ({
      role: m.from === 'me' ? 'user' : 'assistant',
      content: m.t
    }));
    const t0 = Date.now();
    const fail = () => this.setState(s => ({
      typing: false,
      msgs: [...s.msgs, { from: 'bot', t: this.props.t("RideffNana.iMStillAPreviewSo"), acts: true }]
    }));
    try {
      const res = await fetch('/api/nana/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId: this.sid, page: this.page(), locale: this.props.locale, messages: history })
      });
      if (!res.ok || !res.body) return fail();
      const acts = (res.headers.get('x-nana-actions') || '').split(',').filter(Boolean).length > 0;
      // Keep the "typing…" beat from the prototype before the first words appear.
      await new Promise(r => setTimeout(r, Math.max(0, 700 - (Date.now() - t0))));
      const reader = res.body.getReader(), dec = new TextDecoder();
      let text = '', started = false;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += dec.decode(value, { stream: true });
        if (!this.alive) return;
        if (!started) {
          started = true;
          this.setState(s => ({ typing: false, msgs: [...s.msgs, { from: 'bot', t: text, acts: false, live: true }] }));
        } else {
          this.setState(s => ({ msgs: s.msgs.map(m => m.live ? { ...m, t: text } : m) }));
        }
      }
      if (!started) return fail();
      this.setState(s => ({ msgs: s.msgs.map(m => m.live ? { from: 'bot', t: text, acts } : m) }));
    } catch (e) {
      fail();
    }
  };
  callNana = () => {
    if (this.state.call === 'idle') nanaEvent('nana_call_click', { page: this.page() });
    if (this.state.call !== 'idle') return this.setState({
      open: true,
      mode: 'call'
    });
    if (this.props.callSheet === false) {
      this.setState({
        open: true
      });
      return this.startCall();
    }
    this.setState({
      open: true,
      mode: 'pre'
    });
  };
  /** Mic permission + POST /api/nana/voice/session, then the call UI runs. */
  /**
   * Voice. Mic permission first (the pre-call sheet promises the prompt), then
   * POST /api/nana/voice/session: ElevenLabs → live WebRTC call with the agent;
   * mock → the scripted café call.
   */
  startCall = async () => {
    clearInterval(this.ci);
    this.real = false;
    this.vcId = null;
    this.setState({
      mode: 'call',
      call: 'ringing',
      sec: 0,
      line: 0,
      muted: false,
      vmode: 'listening',
      t0: 0
    });
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        this.mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) {
        this.setState(s => ({
          mode: 'chat',
          call: 'idle',
          msgs: [...s.msgs, { from: 'sys', t: this.props.t("nana.micBlocked") }]
        }));
        return;
      }
    }
    if (this.state.call !== 'ringing') return this.stopMic();
    let data = null;
    try {
      const res = await fetch('/api/nana/voice/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId: this.sid, locale: this.props.locale, page: this.page() })
      });
      data = res.ok ? await res.json() : null;
    } catch (e) {}
    if (this.state.call !== 'ringing') return this.stopMic();
    if (data && data.provider === 'elevenlabs') {
      // The SDK opens its own microphone stream.
      this.stopMic();
      this.real = true;
      this.SCRIPT = [];
      try {
        this.vc = await startVoice({
          token: data.token,
          livekitUrl: data.livekitUrl,
          locale: this.props.locale,
          page: this.page(),
          onConnect: id => {
            this.vcId = id;
            nanaEvent('nana_call_start', { page: this.page(), consent: this.state.consent !== false });
            this.setState({ call: 'live', t0: Date.now() });
          },
          onLine: (who, text) => {
            this.SCRIPT = [...this.SCRIPT, [who, text]];
            this.setState({ line: this.SCRIPT.length });
          },
          onMode: vmode => this.setState({ vmode }),
          // Agent hung up or the connection dropped: wrap up like a normal end.
          onEnd: () => { if (this.state.call !== 'idle' && !this.ending) this.endCall(); },
          onError: () => {}
        });
        if (this.state.call === 'idle') this.endVoice();
      } catch (e) {
        this.vc = null;
        this.setState(s => ({
          mode: 'chat',
          call: 'idle',
          msgs: [...s.msgs, { from: 'sys', t: this.props.t("nana.callFailed") }]
        }));
        return;
      }
      this.ci = setInterval(() => this.setState(s => {
        const vc = this.vc;
        let lv = 0;
        try { lv = vc ? (s.vmode === 'speaking' ? vc.getOutputVolume() : vc.getInputVolume() * .6) : 0; } catch (e) {}
        return s.call === 'live' ? { lv: Math.min(1, lv * 1.6), sec: Math.floor((Date.now() - s.t0) / 1000) } : { lv };
      }), 140);
      return;
    }
    // Mock provider: play the scripted call.
    if (data && Array.isArray(data.script) && data.script.length) this.SCRIPT = data.script.map(l => [l.who, l.text]);
    clearTimeout(this.ct);
    this.ct = setTimeout(() => {
      if (this.state.call === 'ringing') {
        nanaEvent('nana_call_start', { page: this.page(), consent: this.state.consent !== false });
        this.setState({
          call: 'live',
          t0: Date.now()
        });
      }
    }, 1400);
    this.ci = setInterval(() => this.setState(s => {
      if (s.call !== 'live') return {
        lv: Math.random()
      };
      const sec = Math.floor((Date.now() - s.t0) / 1000);
      return {
        lv: Math.random(),
        sec,
        line: Math.min(this.SCRIPT.length, Math.floor(sec / 3))
      };
    }), 140);
  };
  endVoice = async () => {
    const vc = this.vc;
    this.vc = null;
    if (vc) {
      try { await vc.endSession(); } catch (e) {}
    }
  };
  stopMic = () => {
    if (this.mic) this.mic.getTracks().forEach(tr => tr.stop());
    this.mic = null;
  };
  /** POST /api/nana/summary → { kind, duration, need, interest, next, text } */
  fetchSum = async (kind, duration, transcript, conversationId) => {
    const res = await fetch('/api/nana/summary', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sessionId: this.sid, locale: this.props.locale, kind, duration, transcript, consent: kind === 'call' ? this.state.consent !== false : false, conversationId: conversationId || undefined })
    });
    if (!res.ok) throw new Error(String(res.status));
    const d = await res.json();
    nanaEvent('nana_summary_created', { kind });
    return { meta: d.kind + ' · ' + d.duration, text: d.text };
  };
  endCall = async () => {
    if (this.ending) return;
    this.ending = true;
    clearInterval(this.ci);
    clearTimeout(this.ct);
    this.stopMic();
    const conversationId = this.real ? this.vcId : null;
    this.endVoice();
    nanaEvent('nana_call_end', { seconds: this.state.sec });
    const sec = this.state.sec,
      d = this.fmt(sec),
      heard = this.state.line >= 2,
      transcript = this.SCRIPT.slice(0, this.state.line).map(l => ({ from: l[0], text: l[1] }));
    this.setState(s => ({
      mode: 'chat',
      call: 'idle',
      t0: 0,
      ...this.resetSum(null),
      typing: heard,
      msgs: [...s.msgs.filter(m => m.from !== 'sum'), {
        from: 'sys',
        t: this.props.t("RideffNana.voiceCallEnded") + d
      }, ...(heard ? [] : [{
        from: 'bot',
        t: this.props.t("RideffNana.callEndedEarlyWantToTry"),
        acts: true
      }])]
    }));
    this.ending = false;
    if (!heard) return;
    let sum = null;
    try {
      sum = await this.fetchSum('call', sec, transcript, conversationId);
    } catch (e) {}
    if (!this.alive) return;
    this.setState(s => ({
      typing: false,
      ...this.resetSum(sum),
      msgs: [...s.msgs, ...(sum ? [{
        from: 'bot',
        t: this.props.t("RideffNana.thanksForCallingHereSA")
      }, {
        from: 'sum'
      }] : [{
        from: 'bot',
        t: this.props.t("RideffNana.callEndedEarlyWantToTry"),
        acts: true
      }])]
    }));
  };
  chatSum = async () => {
    const transcript = this.state.msgs.filter(m => (m.from === 'me' || m.from === 'bot') && !m.choice).map(m => ({ from: m.from === 'me' ? 'you' : 'nana', text: m.t })),
      questions = transcript.filter(l => l.from === 'you').length;
    this.setState({ typing: true });
    // End the text session so ElevenLabs can analyse it; a new message opens a new one.
    const conversationId = this.tc ? this.tcId : null;
    await this.closeChat();
    let sum = null;
    try {
      sum = await this.fetchSum('chat', questions, transcript, conversationId);
    } catch (e) {}
    if (!this.alive) return;
    this.setState(s => ({
      typing: false,
      ...this.resetSum(sum),
      msgs: [...s.msgs.filter(m => m.from !== 'sum'), ...(sum ? [{
        from: 'bot',
        t: this.props.t("RideffNana.hereSWhatWeCoveredCheck")
      }, {
        from: 'sum'
      }] : [{ from: 'sys', t: this.props.t("nana.sendFailed") }])]
    }));
  };
  resetSum = sum => ({
    sum,
    editing: false,
    copied: false,
    mineOpen: false,
    mineSent: false
  });
  sumLines(text) {
    return text.split('\n').map(t => {
      const b = /^\*(.+)\*$/.exec(t),
        i = /^_(.+)_$/.exec(t);
      return {
        t: b ? b[1] : i ? i[1] : t,
        fw: b ? 600 : 400,
        fi: i ? 'italic' : 'normal',
        c: i ? '#8C877E' : '#0A0A0A',
        fs: i ? '12px' : '13.5px',
        h: t === '' ? '8px' : 'auto'
      };
    });
  }
  fmt = n => Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0');
  componentDidUpdate(pp, ps) {
    if (ps.open !== this.state.open || ps.msgs !== this.state.msgs || ps.typing !== this.state.typing || ps.mode !== this.state.mode) {
      const go = () => document.querySelectorAll('[data-nn-list]').forEach(el => {
        el.scrollTop = el.scrollHeight;
      });
      go();
      requestAnimationFrame(go);
      clearTimeout(this.st);
      this.st = setTimeout(go, 120);
    }
  }
  componentWillUnmount() {
    this.alive = false;
    this.stopMic();
    this.endVoice();
    this.closeChat();
    clearTimeout(this.rt);
    window.removeEventListener('resize', this.onR);
    clearInterval(this.ci);
    clearTimeout(this.ct);
    clearTimeout(this.tt);
    clearTimeout(this.cpt);
  }
  renderVals() {
    const s = this.state,
      chat = s.open && s.mode === 'chat',
      call = s.open && s.mode === 'call',
      live = s.call === 'live';
    const msgs = s.msgs.map((m, i) => ({
      t: m.t,
      acts: !!m.acts,
      choice: !!m.choice && !s.msgs.some(x => x.from !== 'bot') && s.call === 'idle',
      isSys: m.from === 'sys',
      isSum: m.from === 'sum' && !!s.sum,
      isTxt: m.from !== 'sys' && m.from !== 'sum',
      align: m.from === 'me' ? 'flex-end' : 'flex-start',
      bg: m.from === 'me' ? '#0A0A0A' : '#ECE8E1',
      fg: m.from === 'me' ? '#F4F4F2' : '#0A0A0A',
      rad: m.from === 'me' ? '14px 14px 4px 14px' : '14px 14px 14px 4px'
    }));
    const speaking = live && (this.real ? s.vmode === 'speaking' : s.line > 0 && this.SCRIPT[s.line - 1][0] === 'nana');
    const amp = live && !s.muted ? speaking ? 1 : .45 : .12;
    const bars = Array.from({
      length: 7
    }, (_, i) => ({
      h: Math.max(4, Math.round(28 * amp * (0.35 + 0.65 * Math.abs(Math.sin((s.lv + i * .37) * 6.28))))) + 'px',
      c: speaking ? '#FF6A00' : '#5A5650'
    }));
    const meCount = s.msgs.filter(m => m.from === 'me').length;
    const chips = this.CHIPS[this.page()].map(q => ({
      q,
      go: () => this.ask(q),
      bg: '#F7F5F1',
      bd: '#BDB6AA'
    }));
    if (meCount >= 2 && !s.sum && s.call === 'idle') chips.unshift({
      q: this.props.t("RideffNana.summarizeForWhatsApp"),
      go: this.chatSum,
      bg: '#FFE3CC',
      bd: '#FF6A00'
    });
    const text = s.sum ? s.sum.text : '';
    return {
      ...(() => {
        const m = (s.vw || 1400) < 560 && s.open;
        return {
          oR: m ? '0px' : '20px',
          oB: m ? '0px' : '20px',
          pW: m ? '100vw' : 'min(380px,calc(100vw - 40px))',
          pR: m ? '0px' : '24px',
          pHc: m ? '100dvh' : 'min(600px,calc(100vh - 120px))',
          pHk: m ? '100dvh' : 'min(560px,calc(100vh - 120px))',
          pHp: m ? '100dvh' : 'auto',
          pMax: m ? '100dvh' : 'calc(100vh - 120px)',
          showLauncher: !m
        };
      })(),
      openChat: chat,
      openCall: call,
      openPre: s.open && s.mode === 'pre',
      listRef: this.setList,
      inputRef: this.inputRef,
      launcherT: s.call !== 'idle' ? this.props.t("RideffNana.onCall") + this.fmt(s.sec) : this.props.t("RideffNana.askNana"),
      callBtnT: s.call !== 'idle' ? this.props.t("RideffNana.backToCall") : this.props.t("nana.call"),
      toggle: () => {
        if (!s.open) nanaEvent('nana_open', { page: this.page() });
        this.setState(st => ({
          open: !st.open,
          mode: st.call !== 'idle' ? 'call' : 'chat'
        }));
      },
      status: s.call !== 'idle' ? this.props.t("RideffNana.onACall") + this.fmt(s.sec) : s.typing ? this.props.t("RideffNana.typing") : this.props.t(this.props.live ? "nana.statusLive" : "RideffNana.textOrVoicePreview"),
      msgs,
      typing: s.typing,
      chips,
      draft: s.draft,
      onDraft: e => this.setState({
        draft: e.target.value
      }),
      send: e => {
        e.preventDefault();
        this.ask(s.draft);
      },
      focusInput: () => this.inputRef.current && this.inputRef.current.focus(),
      consent: s.consent !== false,
      toggleConsent: () => this.setState(st => ({
        consent: st.consent === false
      })),
      callBtnT2: this.props.t("nana.call"),
      callNana: this.callNana,
      beginCall: this.startCall,
      cancelPre: () => this.setState({
        mode: 'chat'
      }),
      ringing: s.call === 'ringing',
      callState: s.call === 'ringing' ? this.props.t("RideffNana.connecting") : s.muted ? this.props.t("RideffNana.muted") : speaking ? this.props.t("RideffNana.speaking") : this.props.t("RideffNana.listening"),
      timer: this.fmt(s.sec),
      timerC: live ? '#F4F4F2' : '#5A5650',
      pulse: (1 + (speaking ? s.lv * .08 : 0)).toFixed(3),
      bars,
      lines: this.SCRIPT.slice(0, s.line).slice(-3).map((l, i, a) => ({
        who: l[0] === 'nana' ? 'Nana' : this.props.t("RideffNana.you"),
        t: l[1],
        c: l[0] === 'nana' ? '#FF9A50' : '#8C877E',
        op: i === a.length - 1 ? 1 : .45
      })),
      muteT: s.muted ? this.props.t("RideffNana.unmute") : this.props.t("RideffNana.mute"),
      muteBg: s.muted ? '#F4F4F2' : 'transparent',
      muteFg: s.muted ? '#0A0A0A' : '#F4F4F2',
      toggleMute: () => {
        try { this.vc && this.vc.setMicMuted(!s.muted); } catch (e) {}
        this.setState(st => ({
          muted: !st.muted
        }));
      },
      toChat: () => this.setState({
        mode: 'chat'
      }),
      endCall: this.endCall,
      sumMeta: s.sum ? s.sum.meta : '',
      sumText: text,
      sumLines: this.sumLines(text),
      editing: s.editing,
      notEditing: !s.editing,
      editT: s.editing ? this.props.t("RideffNana.done") : this.props.t("RideffNana.edit"),
      toggleEdit: () => this.setState(st => ({
        editing: !st.editing
      })),
      onSumText: e => this.setState({
        sum: {
          ...s.sum,
          text: e.target.value
        }
      }),
      onWaRialto: () => nanaEvent('nana_summary_wa_rialto'),
      waHref: 'https://wa.me/' + this.WA + '?text=' + encodeURIComponent(text),
      copyT: s.copied ? this.props.t("RideffNana.copied") : this.props.t("RideffNana.copyText"),
      copySum: () => {
        try {
          navigator.clipboard.writeText(text);
        } catch (e) {}
        nanaEvent('nana_summary_copy');
        this.setState({
          copied: true
        });
        clearTimeout(this.cpt);
        this.cpt = setTimeout(() => this.setState({
          copied: false
        }), 1800);
      },
      mineOpen: s.mineOpen,
      mineSent: s.mineSent,
      mineForm: !s.mineSent,
      mineBg: s.mineOpen ? '#F3EFE8' : 'transparent',
      toggleMine: () => this.setState(st => ({
        mineOpen: !st.mineOpen
      })),
      phone: s.phone,
      onPhone: e => this.setState({
        phone: e.target.value
      }),
      /** POST /api/nana/whatsapp: explicit opt-in = typing the number and pressing Send. */
      sendMine: async e => {
        e.preventDefault();
        if (s.phone.trim().length < 6 || s.mineBusy) return;
        this.setState({ mineBusy: true, mineErr: '' });
        try {
          const res = await fetch('/api/nana/whatsapp', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ sessionId: this.sid, phone: s.phone, text, optIn: true })
          });
          if (!res.ok) throw new Error(String(res.status));
          nanaEvent('nana_summary_wa_self');
          this.setState({ mineSent: true, mineBusy: false });
        } catch (er) {
          this.setState({ mineBusy: false, mineErr: this.props.t("nana.sendFailed") });
        }
      },
      mineErr: s.mineErr || '',
      mineBusy: !!s.mineBusy
    };
  }
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "@keyframes nnRing{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.9);opacity:0}}\n@keyframes nnDot{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}\n@keyframes nnIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}" }} />
      <div style={{ position: "fixed", right: `${v.oR ?? ''}`, bottom: `${v.oB ?? ''}`, zIndex: "60", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px", fontFamily: "var(--font-sans)" }}>
        {v.openChat ? (<>
          {" "}
          <div style={{ width: `${v.pW ?? ''}`, height: `${v.pHc ?? ''}`, background: "#F7F5F1", color: "#0A0A0A", borderRadius: `${v.pR ?? ''}`, boxShadow: "0 30px 80px rgba(10,10,10,.3)", overflow: "hidden", display: "flex", flexDirection: "column", animation: "nnIn .35s cubic-bezier(.16,1,.3,1) both" }}>
            <div style={{ background: "#0A0A0A", color: "#F4F4F2", padding: "14px 14px 14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ position: "relative", width: "34px", height: "34px", borderRadius: "50%", background: "#FF6A00" }}>
                  <span style={{ position: "absolute", right: "-1px", bottom: "-1px", width: "10px", height: "10px", borderRadius: "50%", background: "#61C784", border: "2px solid #0A0A0A" }} />
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <b style={{ fontSize: "15px" }}>
                    {"Nana"}
                  </b>
                  <span style={{ fontSize: "11px", color: "#8C877E" }}>
                    {v.status}
                  </span>
                </span>
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <button onClick={v.callNana} style={{ display: "flex", alignItems: "center", gap: "6px", border: "none", background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "8px 14px", font: "600 13px var(--font-sans)", cursor: "pointer" }}>
                  {v.callBtnT2}
                </button>
                <button onClick={v.toggle} aria-label={v.t("nana.close")} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1C1C1E", border: "none", color: "#8C877E", cursor: "pointer", fontSize: "16px" }}>
                  {"×"}
                </button>
              </div>
            </div>
            <div data-nn-list="1" data-lenis-prevent="1" role="log" aria-live="polite" style={{ flex: "1", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", overflow: "auto" }}>
              {(v.msgs ?? []).map((m, $index) => (<Fragment key={$index}>
                {" "}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: `${m?.align ?? ''}`, animation: "nnIn .3s both" }}>
                  {m?.isSys ? (<>
                    <span style={{ alignSelf: "center", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase", color: "#8C877E", padding: "4px 0" }}>
                      {m?.t}
                    </span>
                  </>) : null}
                  {m?.isTxt ? (<>
                    <div style={{ maxWidth: "86%", background: `${m?.bg ?? ''}`, color: `${m?.fg ?? ''}`, borderRadius: `${m?.rad ?? ''}`, padding: "11px 14px", fontSize: "14px", lineHeight: "1.45", textWrap: "pretty" }}>
                      {m?.t}
                    </div>
                  </>) : null}
                  {m?.choice ? (<>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <button onClick={v.focusInput} style={{ border: "1px solid #BDB6AA", background: "#F7F5F1", color: "#0A0A0A", borderRadius: "999px", padding: "8px 14px", font: "500 13px var(--font-sans)", whiteSpace: "nowrap", cursor: "pointer" }} className="hv-9e000e8">
                        {v.t("RideffNana.typeAQuestion")}
                      </button>
                      <button onClick={v.callNana} style={{ display: "flex", alignItems: "center", gap: "8px", border: "none", background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "8px 14px", font: "600 13px var(--font-sans)", cursor: "pointer" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0A0A0A" }} />
                        {v.t("RideffNana.callNanaVoice")}
                      </button>
                    </div>
                  </>) : null}
                  {m?.acts ? (<>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <a href={v.href("/contact")} style={{ background: "#0A0A0A", color: "#F4F4F2", borderRadius: "999px", padding: "8px 14px", font: "600 13px var(--font-sans)", textDecoration: "none" }}>
                        {v.t("RideffNana.bookACallWithRialto")}
                      </a>
                      <a href="https://wa.me/4917632572420" target="_blank" rel="noopener" style={{ border: "1px solid #BDB6AA", color: "#0A0A0A", borderRadius: "999px", padding: "8px 14px", font: "500 13px var(--font-sans)", textDecoration: "none" }}>
                        {"WhatsApp"}
                      </a>
                    </div>
                  </>) : null}
                  {m?.isSum ? (<>
                    {" "}
                    <div style={{ alignSelf: "stretch", background: "#FFFFFF", border: "1px solid #E2DDD4", borderRadius: "18px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", padding: "12px 14px", borderBottom: "1px solid #EFEBE4" }}>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <b style={{ fontSize: "14px" }}>
                            {v.t("RideffNana.yourSummary")}
                          </b>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase", color: "#8C877E" }}>
                            {v.sumMeta}
                          </span>
                        </span>
                        <button onClick={v.toggleEdit} style={{ border: "1px solid #BDB6AA", background: "transparent", borderRadius: "999px", padding: "6px 12px", font: "500 12px var(--font-sans)", color: "#0A0A0A", cursor: "pointer" }}>
                          {v.editT}
                        </button>
                      </div>
                      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase", color: "#8C877E" }}>
                          {v.t("RideffNana.whatsAppMessage")}
                        </span>
                        {v.notEditing ? (<>
                          {" "}
                          <div style={{ background: "#F3EFE8", borderRadius: "4px 14px 14px 14px", padding: "12px 14px", display: "flex", flexDirection: "column", fontSize: "13.5px", lineHeight: "1.45", color: "#0A0A0A" }}>
                            {(v.sumLines ?? []).map((l, $index) => (<Fragment key={$index}>
                              <span style={{ display: "block", minHeight: `${l?.h ?? ''}`, fontWeight: `${l?.fw ?? ''}`, fontStyle: `${l?.fi ?? ''}`, color: `${l?.c ?? ''}`, fontSize: `${l?.fs ?? ''}`, textWrap: "pretty" }}>
                                {l?.t}
                              </span>
                            </Fragment>))}
                          </div>
                          {" "}
                        </>) : null}
                        {v.editing ? (<>
                          {" "}
                          <textarea value={v.sumText ?? ''} onChange={v.onSumText} rows="12" style={{ width: "100%", boxSizing: "border-box", resize: "vertical", background: "#F3EFE8", border: "1px solid #FF6A00", outline: "none", borderRadius: "12px", padding: "12px", font: "400 13px/1.5 var(--font-mono)", color: "#0A0A0A" }} />
                          {" "}
                          <span style={{ fontSize: "11px", color: "#8C877E" }}>
                            {v.t("RideffNana.boldAndItalicShowAsFormatting")}
                          </span>
                          {" "}
                        </>) : null}
                      </div>
                      <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <a href={v.waHref} onClick={v.onWaRialto} target="_blank" rel="noopener" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", background: "#0A0A0A", color: "#F4F4F2", borderRadius: "999px", padding: "12px 16px", font: "600 14px var(--font-sans)", textDecoration: "none" }} className="hv-b9fc66e">
                          {v.t("RideffNana.sendToRialtoOnWhatsApp")}
                        </a>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={v.copySum} style={{ flex: "1", border: "1px solid #BDB6AA", background: "transparent", borderRadius: "999px", padding: "9px 12px", font: "500 13px var(--font-sans)", color: "#0A0A0A", cursor: "pointer" }}>
                            {v.copyT}
                          </button>
                          <button onClick={v.toggleMine} style={{ flex: "1", border: "1px solid #BDB6AA", background: `${v.mineBg ?? ''}`, borderRadius: "999px", padding: "9px 12px", font: "500 13px var(--font-sans)", color: "#0A0A0A", cursor: "pointer" }}>
                            {v.t("RideffNana.sendToMyWhatsApp")}
                          </button>
                        </div>
                        {v.mineOpen ? (<>
                          {" "}
                          {v.mineSent ? (<>
                            <span style={{ fontSize: "13px", color: "#2E8B57", padding: "4px 2px" }}>
                              {v.t("RideffNana.sentToX", { x: v.phone })}
                            </span>
                          </>) : null}
                          {" "}
                          {v.mineForm ? (<>
                            {" "}
                            <form onSubmit={v.sendMine} style={{ display: "flex", gap: "6px", margin: "0" }}>
                              <input value={v.phone ?? ''} onChange={v.onPhone} placeholder="+49 …" inputMode="tel" type="tel" autoComplete="tel" aria-label={v.t("nana.phoneLabel")} style={{ flex: "1", minWidth: "0", background: "#F3EFE8", border: "none", outline: "none", borderRadius: "999px", padding: "10px 14px", font: "400 14px var(--font-sans)", color: "#0A0A0A" }} />
                              <button type="submit" style={{ border: "none", background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "0 16px", font: "600 13px var(--font-sans)", cursor: "pointer" }}>
                                {v.t("RideffNana.send")}
                              </button>
                            </form>
                            {v.mineErr ? (<div role="alert" style={{ font: "400 12px var(--font-sans)", color: "#E5484D", marginTop: "6px" }}>{v.mineErr}</div>) : null}
                            {" "}
                          </>) : null}
                          {" "}
                        </>) : null}
                      </div>
                    </div>
                    {" "}
                  </>) : null}
                </div>
                {" "}
              </Fragment>))}
              {v.typing ? (<>
                <div style={{ alignSelf: "flex-start", display: "flex", gap: "4px", background: "#ECE8E1", borderRadius: "14px 14px 14px 4px", padding: "14px 16px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5A5650", animation: "nnDot 1.1s infinite" }} />
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5A5650", animation: "nnDot 1.1s .15s infinite" }} />
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5A5650", animation: "nnDot 1.1s .3s infinite" }} />
                </div>
              </>) : null}
            </div>
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "0 12px 10px" }}>
              {(v.chips ?? []).map((c, $index) => (<Fragment key={$index}>
                <button onClick={c?.go} style={{ flexShrink: "0", cursor: "pointer", border: `1px solid ${c?.bd ?? ''}`, background: `${c?.bg ?? ''}`, borderRadius: "999px", padding: "7px 12px", font: "500 13px var(--font-sans)", whiteSpace: "nowrap", color: "#0A0A0A" }} className="hv-f543883">
                  {c?.q}
                </button>
              </Fragment>))}
            </div>
            <form onSubmit={v.send} style={{ display: "flex", gap: "8px", padding: "12px", borderTop: "1px solid #E2DDD4", margin: "0" }}>
              <input ref={v.inputRef} value={v.draft ?? ''} onChange={v.onDraft} aria-label={v.t("nana.messageLabel")} placeholder={v.t("RideffNana.askNanaAnything")} style={{ flex: "1", minWidth: "0", background: "#ECE8E1", border: "none", outline: "none", borderRadius: "999px", padding: "12px 16px", font: "400 14px var(--font-sans)", color: "#0A0A0A" }} />
              <button type="submit" aria-label={v.t("RideffNana.send")} style={{ width: "44px", height: "44px", flexShrink: "0", border: "none", background: "#0A0A0A", color: "#F4F4F2", borderRadius: "50%", cursor: "pointer", fontSize: "16px" }}>
                {"↑"}
              </button>
            </form>
          </div>
          {" "}
        </>) : null}
        {v.openPre ? (<>
          {" "}
          <div style={{ width: `${v.pW ?? ''}`, maxHeight: `${v.pMax ?? ''}`, height: `${v.pHp ?? ''}`, background: "#0B0B0C", color: "#F4F4F2", borderRadius: `${v.pR ?? ''}`, boxShadow: "0 30px 80px rgba(10,10,10,.45)", overflow: "auto", display: "flex", flexDirection: "column", animation: "nnIn .35s cubic-bezier(.16,1,.3,1) both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
                {v.t(v.live ? "nana.voiceCallLive" : "RideffNana.voiceCallPreview")}
              </span>
              <button onClick={v.cancelPre} aria-label={v.t("nana.close")} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1C1C1E", border: "none", color: "#8C877E", cursor: "pointer", fontSize: "16px" }}>
                {"×"}
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "8px 24px 22px", textAlign: "center" }}>
              <span style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#FF6A00" }} />
              <b style={{ fontSize: "22px", letterSpacing: "-0.02em" }}>
                {v.t("RideffNana.talkToNana")}
              </b>
              <span style={{ fontSize: "14px", lineHeight: "1.45", color: "#B5AFA5", maxWidth: "280px", textWrap: "pretty" }}>
                {v.t("RideffNana.askOutLoudTheWayYou")}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", margin: "0 18px", borderTop: "1px solid #1F1F21" }}>
              <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: "12px", padding: "12px 0", borderBottom: "1px solid #1F1F21" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase", color: "#8C877E", paddingTop: "2px" }}>
                  {v.t("RideffNana.mic")}
                </span>
                <span style={{ fontSize: "13px", lineHeight: "1.45" }}>
                  {v.t("RideffNana.yourBrowserAsksForTheMicrophone")}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: "12px", padding: "12px 0", borderBottom: "1px solid #1F1F21" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase", color: "#8C877E", paddingTop: "2px" }}>
                  {v.t("RideffNana.length")}
                </span>
                <span style={{ fontSize: "13px", lineHeight: "1.45" }}>
                  {v.t("RideffNana.about2MinutesSwitchToChat")}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: "12px", padding: "12px 0" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase", color: "#8C877E", paddingTop: "2px" }}>
                  {v.t("RideffNana.after")}
                </span>
                <span style={{ fontSize: "13px", lineHeight: "1.45" }}>
                  {v.t("RideffNana.youGetASummaryYouCan")}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "18px" }}>
              <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "12.5px", lineHeight: "1.45", color: "#B5AFA5", cursor: "pointer", padding: "0 2px 6px" }}>
                <input type="checkbox" checked={!!(v.consent)} onChange={v.toggleConsent} style={{ accentColor: "#FF6A00", width: "16px", height: "16px", margin: "1px 0 0", flexShrink: "0" }} />
                <span>
                  {v.t("RideffNana.saveTheTranscriptAndSummaryTo")}{" "}
                  <a href={v.href("/datenschutz")} style={{ color: "#FF9A50" }}>
                    {v.t("RideffNana.privacy")}
                  </a>
                </span>
              </label>
              <button onClick={v.beginCall} style={{ border: "none", background: "#FF6A00", color: "#0A0A0A", borderRadius: "999px", padding: "14px", font: "600 15px var(--font-sans)", cursor: "pointer" }}>
                {v.t("RideffNana.startCall")}
              </button>
              <button onClick={v.cancelPre} style={{ border: "none", background: "transparent", color: "#8C877E", padding: "8px", font: "500 13px var(--font-sans)", cursor: "pointer" }}>
                {v.t("RideffNana.notNowTypeInstead")}
              </button>
            </div>
          </div>
          {" "}
        </>) : null}
        {v.openCall ? (<>
          {" "}
          <div style={{ width: `${v.pW ?? ''}`, height: `${v.pHk ?? ''}`, background: "#0B0B0C", color: "#F4F4F2", borderRadius: `${v.pR ?? ''}`, boxShadow: "0 30px 80px rgba(10,10,10,.45)", overflow: "hidden", display: "flex", flexDirection: "column", animation: "nnIn .35s cubic-bezier(.16,1,.3,1) both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8C877E" }}>
                {v.t(v.live ? "nana.voiceLive" : "RideffNana.voicePreview")}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: `${v.timerC ?? ''}` }}>
                {v.timer}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "18px", padding: "18px 0 10px" }}>
              <div style={{ position: "relative", width: "112px", height: "112px" }}>
                {" "}
                {v.ringing ? (<>
                  <span style={{ position: "absolute", inset: "0", borderRadius: "50%", border: "2px solid #FF6A00", animation: "nnRing 1.6s ease-out infinite" }} />
                  <span style={{ position: "absolute", inset: "0", borderRadius: "50%", border: "2px solid #FF6A00", animation: "nnRing 1.6s .8s ease-out infinite" }} />
                </>) : null}
                {" "}
                <span style={{ position: "absolute", inset: "0", borderRadius: "50%", background: "#FF6A00", transform: `scale(${v.pulse ?? ''})`, transition: "transform .14s ease-out" }} />
                {" "}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <b style={{ fontSize: "22px", letterSpacing: "-0.02em" }}>
                  {"Nana"}
                </b>
                <span style={{ fontSize: "13px", color: "#8C877E" }}>
                  {v.callState}
                </span>
              </div>
              <div style={{ display: "flex", gap: "4px", alignItems: "center", height: "28px" }}>
                {(v.bars ?? []).map((b, $index) => (<Fragment key={$index}>
                  <span style={{ width: "4px", borderRadius: "2px", background: `${b?.c ?? ''}`, height: `${b?.h ?? ''}`, transition: "height .12s" }} />
                </Fragment>))}
              </div>
            </div>
            <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "10px", padding: "0 20px 16px", overflow: "hidden" }}>
              {(v.lines ?? []).map((l, $index) => (<Fragment key={$index}>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px", opacity: `${l?.op ?? ''}`, animation: "nnIn .4s both" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase", color: `${l?.c ?? ''}` }}>
                    {l?.who}
                  </span>
                  <span style={{ fontSize: "14px", lineHeight: "1.45" }}>
                    {l?.t}
                  </span>
                </div>
              </Fragment>))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", padding: "16px 0 22px", borderTop: "1px solid #1F1F21" }}>
              <button onClick={v.toggleMute} style={{ width: "56px", height: "56px", borderRadius: "50%", border: "1px solid #2A2A2C", background: `${v.muteBg ?? ''}`, color: `${v.muteFg ?? ''}`, cursor: "pointer", font: "600 11px var(--font-mono)", letterSpacing: ".06em", textTransform: "uppercase" }}>
                {v.muteT}
              </button>
              <button onClick={v.toChat} style={{ width: "56px", height: "56px", borderRadius: "50%", border: "1px solid #2A2A2C", background: "transparent", color: "#F4F4F2", cursor: "pointer", font: "600 11px var(--font-mono)", letterSpacing: ".06em", textTransform: "uppercase" }}>
                {v.t("RideffNana.chat")}
              </button>
              <button onClick={v.endCall} style={{ width: "56px", height: "56px", borderRadius: "50%", border: "none", background: "#E5484D", color: "#FFFFFF", cursor: "pointer", font: "600 11px var(--font-mono)", letterSpacing: ".06em", textTransform: "uppercase" }}>
                {v.t("RideffNana.end")}
              </button>
            </div>
          </div>
          {" "}
        </>) : null}
        {v.showLauncher ? (<>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#F4F1EC", border: "1px solid rgba(10,10,10,.08)", borderRadius: "999px", padding: "6px", boxShadow: "0 12px 30px rgba(10,10,10,.2)" }}>
              <button onClick={v.toggle} style={{ display: "flex", alignItems: "center", gap: "10px", background: "transparent", color: "#0A0A0A", border: "none", borderRadius: "999px", padding: "1px 10px 1px 1px", font: "600 15px var(--font-sans)", whiteSpace: "nowrap", cursor: "pointer" }}>
                <span style={{ position: "relative", width: "36px", height: "36px", borderRadius: "50%", background: "#FF6A00" }}>
                  <span style={{ position: "absolute", right: "0", bottom: "0", width: "10px", height: "10px", borderRadius: "50%", background: "#61C784", border: "2px solid #F4F1EC" }} />
                </span>
                {v.launcherT}
              </button>
              <span style={{ width: "1px", height: "22px", background: "#D9D3C9" }} />
              <button onClick={v.callNana} title={v.t("RideffNana.callNana")} style={{ display: "flex", alignItems: "center", gap: "6px", border: "none", background: "#0A0A0A", color: "#F4F4F2", borderRadius: "999px", padding: "10px 14px", font: "600 13px var(--font-sans)", whiteSpace: "nowrap", cursor: "pointer" }} className="hv-9bccb67">
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF6A00" }} />
                {v.callBtnT}
              </button>
            </div>
            <a href="https://wa.me/4917632572420" target="_blank" rel="noopener" style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#0A0A0A", color: "#F4F4F2", display: "flex", alignItems: "center", justifyContent: "center", font: "700 12px var(--font-mono)", textDecoration: "none", boxShadow: "0 12px 30px rgba(10,10,10,.2)" }}>
              {"WA"}
            </a>
          </div>
        </>) : null}
      </div>
    </>
  );
};

export default function Nana(props) {
  const dc = useDC();
  return <Logic key={dc.locale} {...dc} {...props} />;
}

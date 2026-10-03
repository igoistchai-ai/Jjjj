(() => {
  'use strict';

  // ===== STATE =====
  const appState = {
    selectedFriend: null,
    giftModalOpen: false,
    giftStep: 'search', // search | loading | friends | profile | sent
    settingsOpen: false,
    extensionEnabled: true,
    balance: 122546312,
    previewMode: '3d',
    chatOpen: false,
    currentGift: {
      name: 'Headless Horseman',
      price: 31000
    }
  };

  const friends = [
    {
      username: 'yannis4444',
      avatar: 'Y',
      mutualFriends: 6,
      joined: 'Nov 9, 2021',
      lastActive: '1 day ago',
      giftPrice: 31000,
      giftName: 'Headless Horseman'
    },
    {
      username: 'Astrix_Gaming',
      avatar: 'A',
      mutualFriends: 4,
      joined: 'Jun 12, 2020',
      lastActive: '2 hours ago',
      giftPrice: 31000,
      giftName: 'Headless Horseman'
    },
    {
      username: '00milose735',
      avatar: '0',
      mutualFriends: 8,
      joined: 'Jan 18, 2019',
      lastActive: '3 hours ago',
      giftPrice: 31000,
      giftName: 'Headless Horseman'
    },
    {
      username: 'fushyfj55',
      avatar: 'F',
      mutualFriends: 3,
      joined: 'May 8, 2022',
      lastActive: '30 minutes ago',
      giftPrice: 31000,
      giftName: 'Headless Horseman'
    },
    {
      username: 'crisostomo654',
      avatar: 'C',
      mutualFriends: 2,
      joined: 'Mar 4, 2018',
      lastActive: '1 hour ago',
      giftPrice: 48000,
      giftName: 'Headless + Korblox'
    },
    {
      username: 'BossDuru1',
      avatar: 'B',
      mutualFriends: 5,
      joined: 'Aug 22, 2017',
      lastActive: '5 hours ago',
      giftPrice: 31000,
      giftName: 'Headless Horseman'
    }
  ];

  // ===== DOM =====
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const overlay = $('#overlay');
  const giftModal = $('#giftModal');
  const stateSearch = $('#stateSearch');
  const stateProfile = $('#stateProfile');
  const stateSent = $('#stateSent');
  const loadingState = $('#loadingState');
  const friendsList = $('#friendsList');
  const friendsLabel = $('#friendsLabel');
  const balanceValue = $('#balanceValue');
  const modalBalance = $('#modalBalance');
  const modalBalanceSent = $('#modalBalanceSent');
  const spBalance = $('#spBalance');
  const settingsPanel = $('#settingsPanel');
  const chatPanel = $('#chatPanel');
  const character = $('#character');
  const preview3d = $('#preview3d');
  const preview2d = $('#preview2d');
  const mode2dBtn = $('#mode2dBtn');

  // ===== HELPERS =====
  function formatNum(n) {
    return n.toLocaleString('en-US');
  }

  function updateBalanceUI() {
    const f = formatNum(appState.balance);
    balanceValue.textContent = f;
    modalBalance.textContent = f;
    modalBalanceSent.textContent = f;
    spBalance.textContent = f;
  }

  function lockScroll(lock) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  function showOverlay(show) {
    overlay.classList.toggle('hidden', !show);
  }

  function hideAllModalStates() {
    stateSearch.classList.add('hidden');
    stateProfile.classList.add('hidden');
    stateSent.classList.add('hidden');
  }

  function showGiftStep(step) {
    appState.giftStep = step;
    hideAllModalStates();
    if (step === 'search' || step === 'loading' || step === 'friends') {
      stateSearch.classList.remove('hidden');
      if (step === 'loading') {
        loadingState.classList.remove('hidden');
        friendsList.classList.add('hidden');
        friendsLabel.textContent = 'My friends';
      } else if (step === 'friends') {
        loadingState.classList.add('hidden');
        friendsList.classList.remove('hidden');
        friendsLabel.textContent = `My friends (${friends.length})`;
      } else {
        loadingState.classList.add('hidden');
        friendsList.classList.add('hidden');
        friendsLabel.textContent = 'My friends';
      }
    } else if (step === 'profile') {
      stateProfile.classList.remove('hidden');
    } else if (step === 'sent') {
      stateSent.classList.remove('hidden');
    }
  }

  function renderFriends(filter = '') {
    const q = filter.toLowerCase().trim();
    const list = friends.filter(f => f.username.toLowerCase().includes(q));
    friendsList.innerHTML = list.map(f => `
      <div class="friend-item" data-user="${f.username}">
        <div class="friend-avatar">${f.avatar}</div>
        <div class="friend-name">${f.username}</div>
      </div>
    `).join('');
    friendsList.querySelectorAll('.friend-item').forEach(el => {
      el.addEventListener('click', () => selectFriend(el.dataset.user));
    });
  }

  // ===== ACTIONS =====
  function openGift() {
    appState.giftModalOpen = true;
    appState.selectedFriend = null;
    appState.currentGift = { name: 'Headless Horseman', price: 31000 };
    $('#giftItemName').textContent = appState.currentGift.name;
    $('#giftItemPrice').textContent = formatNum(appState.currentGift.price);
    showOverlay(true);
    giftModal.classList.remove('hidden');
    lockScroll(true);
    showGiftStep('loading');
    // Simulate loading
    setTimeout(() => {
      if (appState.giftModalOpen && appState.giftStep === 'loading') {
        renderFriends();
        showGiftStep('friends');
      }
    }, 900);
  }

  function closeGift() {
    appState.giftModalOpen = false;
    giftModal.classList.add('hidden');
    showOverlay(false);
    lockScroll(false);
    appState.selectedFriend = null;
    showGiftStep('search');
  }

  function selectFriend(username) {
    const friend = friends.find(f => f.username === username);
    if (!friend) return;
    appState.selectedFriend = friend;
    appState.currentGift = {
      name: friend.giftName,
      price: friend.giftPrice
    };

    $('#profileAvatar').textContent = friend.avatar;
    $('#profileName').textContent = friend.username;
    $('#mutualVal').textContent = friend.mutualFriends;
    $('#joinedVal').textContent = friend.joined;
    $('#activeVal').textContent = friend.lastActive;
    $('#confirmGiftName').textContent = friend.giftName;
    $('#confirmText').textContent = `Send this gift to ${friend.username}?`;
    $('#confirmPrice').textContent = formatNum(friend.giftPrice);

    showGiftStep('profile');
  }

  function sendGift() {
    if (!appState.selectedFriend) return;
    const btn = $('#sendGiftBtn');
    btn.disabled = true;
    btn.textContent = 'Gifting...';

    setTimeout(() => {
      const price = appState.currentGift.price;
      appState.balance = Math.max(0, appState.balance - price);
      updateBalanceUI();

      $('#sentItemName').textContent = appState.currentGift.name;
      $('#sentPrice').textContent = formatNum(price);
      $('#sentTo').textContent = `To ${appState.selectedFriend.username}`;

      btn.disabled = false;
      btn.textContent = 'Gift';
      showGiftStep('sent');
    }, 800);
  }

  function sendAnotherGift() {
    appState.selectedFriend = null;
    appState.currentGift = { name: 'Headless Horseman', price: 31000 };
    $('#giftItemName').textContent = appState.currentGift.name;
    $('#giftItemPrice').textContent = formatNum(appState.currentGift.price);
    showGiftStep('loading');
    setTimeout(() => {
      if (appState.giftModalOpen) {
        renderFriends();
        showGiftStep('friends');
      }
    }, 600);
  }

  function toggleSettings() {
    appState.settingsOpen = !appState.settingsOpen;
    settingsPanel.classList.toggle('hidden', !appState.settingsOpen);
  }

  function saveSettings() {
    const toast = $('#spToast');
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 1500);
  }

  function togglePreviewMode() {
    if (appState.previewMode === '3d') {
      appState.previewMode = '2d';
      preview3d.classList.add('hidden');
      preview2d.classList.remove('hidden');
      mode2dBtn.classList.add('active');
      mode2dBtn.textContent = '3D';
      character.style.animationPlayState = 'paused';
    } else {
      appState.previewMode = '3d';
      preview2d.classList.add('hidden');
      preview3d.classList.remove('hidden');
      mode2dBtn.classList.remove('active');
      mode2dBtn.textContent = '2D';
      character.style.animationPlayState = 'running';
    }
  }

  function openChat() {
    appState.chatOpen = true;
    chatPanel.classList.remove('hidden');
  }

  function closeChat() {
    appState.chatOpen = false;
    chatPanel.classList.add('hidden');
  }

  // ===== EVENTS =====
  $('#giftBtn').addEventListener('click', openGift);
  $('#closeGift').addEventListener('click', closeGift);
  $('#closeGift2').addEventListener('click', closeGift);
  $('#closeGift3').addEventListener('click', closeGift);
  overlay.addEventListener('click', () => {
    if (appState.giftModalOpen) closeGift();
  });

  $('#backToFriends').addEventListener('click', () => {
    showGiftStep('friends');
  });

  $('#sendGiftBtn').addEventListener('click', sendGift);
  $('#sendAnotherBtn').addEventListener('click', sendAnotherGift);

  $('#friendSearch').addEventListener('input', (e) => {
    renderFriends(e.target.value);
  });

  $('#changeGift').addEventListener('click', () => {
    // Demo: toggle between two gifts
    if (appState.currentGift.price === 31000) {
      appState.currentGift = { name: 'Headless + Korblox', price: 48000 };
    } else {
      appState.currentGift = { name: 'Headless Horseman', price: 31000 };
    }
    $('#giftItemName').textContent = appState.currentGift.name;
    $('#giftItemPrice').textContent = formatNum(appState.currentGift.price);
  });

  $('#settingsBtn').addEventListener('click', toggleSettings);
  $('#saveSettings').addEventListener('click', saveSettings);
  $('#extToggle').addEventListener('change', (e) => {
    appState.extensionEnabled = e.target.checked;
  });

  $('#mode2dBtn').addEventListener('click', togglePreviewMode);
  $('#tryOnBtn').addEventListener('click', () => {
    alert('Try On: avatar preview would open here in real Roblox.');
  });

  $('#chatBtn').addEventListener('click', () => {
    if (appState.chatOpen) closeChat();
    else openChat();
  });
  $('#closeChat').addEventListener('click', closeChat);
  $('#sendChat').addEventListener('click', () => {
    const input = $('#chatInput');
    if (input.value.trim()) {
      const body = document.querySelector('.chat-body');
      const msg = document.createElement('div');
      msg.className = 'chat-msg';
      msg.style.marginTop = '6px';
      msg.textContent = input.value;
      body.appendChild(msg);
      input.value = '';
      body.scrollTop = body.scrollHeight;
    }
  });

  // Esc close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (appState.giftModalOpen) closeGift();
      if (appState.settingsOpen) toggleSettings();
      if (appState.chatOpen) closeChat();
    }
  });

  // Click outside settings
  document.addEventListener('click', (e) => {
    if (appState.settingsOpen &&
        !settingsPanel.contains(e.target) &&
        !$('#settingsBtn').contains(e.target)) {
      toggleSettings();
    }
  });

  // Init
  updateBalanceUI();
})();

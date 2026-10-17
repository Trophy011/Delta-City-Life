import React, { useState } from 'react';
import {
  X,
  Users,
  MessageSquare,
  UserPlus,
  Send,
  CheckCircle2,
  Sparkles,
  Search,
  ArrowLeft,
  DollarSign,
  Receipt,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Friend, ChatMessage, PlayerProfile } from '../types';
import { sound } from '../utils/audio';

interface ChatAndFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerProfile;
  friends: Friend[];
  chatMessages: ChatMessage[];
  onSendMessage: (text: string, recipientHandle?: string) => void;
  onSendMoney: (recipientHandle: string, amount: number, memo?: string) => boolean;
  onAddFriend: (username: string) => void;
}

export const ChatAndFriendsModal: React.FC<ChatAndFriendsModalProps> = ({
  isOpen,
  onClose,
  player,
  friends,
  chatMessages,
  onSendMessage,
  onSendMoney,
  onAddFriend,
}) => {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(() => friends[0] || null);
  const [activeTab, setActiveTab] = useState<'dm' | 'contacts' | 'transfer'>('dm');
  const [newFriendInput, setNewFriendInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Send Money Dialog State
  const [isSendMoneyModalOpen, setIsSendMoneyModalOpen] = useState(false);
  const [transferTargetHandle, setTransferTargetHandle] = useState('');
  const [transferAmountInput, setTransferAmountInput] = useState('50000');
  const [transferMemo, setTransferMemo] = useState('For fuel and flexing in Warri');

  if (!isOpen) return null;

  const playerHandle = `@${player.username.toLowerCase().replace(/\s+/g, '')}`;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSendPrivateMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedFriend) return;
    sound.playClick();
    onSendMessage(chatInput.trim(), selectedFriend.handle);
    setChatInput('');
  };

  const handleAddFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const username = newFriendInput.trim();
    if (!username) return;
    sound.playCelebration();
    onAddFriend(username);
    showToast(`✅ Added ${username.startsWith('@') ? username : '@' + username} to contacts!`);
    setNewFriendInput('');
  };

  const openSendMoneyForFriend = (friend: Friend) => {
    setTransferTargetHandle(friend.handle);
    setTransferAmountInput('50000');
    setTransferMemo('For fuel and flexing in Warri');
    setIsSendMoneyModalOpen(true);
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(transferAmountInput, 10);
    if (isNaN(amt) || amt <= 0) {
      showToast('❌ Please enter a valid transfer amount in Naira');
      return;
    }

    if (player.balance < amt) {
      showToast(`❌ Insufficient funds! You need ₦${amt.toLocaleString()} but have ₦${player.balance.toLocaleString()}`);
      return;
    }

    const targetHandle = transferTargetHandle.trim() || (selectedFriend ? selectedFriend.handle : '@player');
    const success = onSendMoney(targetHandle, amt, transferMemo.trim() || 'Direct Naira Transfer');

    if (success) {
      setIsSendMoneyModalOpen(false);
      showToast(`💸 Transferred ₦${amt.toLocaleString()} to ${targetHandle}!`);
    } else {
      showToast('❌ Transfer failed. Check your balance.');
    }
  };

  // Filter messages for 1-on-1 private chat with selectedFriend
  const currentDirectMessages = chatMessages.filter((msg) => {
    if (!selectedFriend) return false;
    const isFromFriendToMe =
      msg.sender === selectedFriend.username || msg.handle === selectedFriend.handle;
    const isFromMeToFriend =
      msg.sender === player.username &&
      (msg.recipientHandle === selectedFriend.handle || !msg.recipientHandle);
    return isFromFriendToMe || isFromMeToFriend;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 p-4 px-5 text-white flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black/20 border border-white/20 flex items-center justify-center text-sky-200 shadow-inner">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black tracking-tight">Delta Private Chat &amp; Transfers</h2>
              <p className="text-xs text-sky-100 font-medium">
                1-on-1 Direct Messaging · Instant Bank Transfers in Naira (₦)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="bg-emerald-950 border-b border-emerald-700 px-4 py-2 text-xs text-center text-emerald-300 font-bold animate-in fade-in">
            {toastMsg}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 pt-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('dm')}
              className={`pb-2.5 px-3 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
                activeTab === 'dm'
                  ? 'text-sky-400 border-b-2 border-sky-400 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Private Chat {selectedFriend ? `(@${selectedFriend.username})` : ''}</span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`pb-2.5 px-3 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
                activeTab === 'contacts'
                  ? 'text-sky-400 border-b-2 border-sky-400 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Contacts ({friends.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('transfer');
                setTransferTargetHandle(selectedFriend ? selectedFriend.handle : '');
              }}
              className={`pb-2.5 px-3 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
                activeTab === 'transfer'
                  ? 'text-emerald-400 border-b-2 border-emerald-400 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Send Money to Anyone</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-400 pb-2">
            <span>Balance:</span>
            <span className="text-emerald-400 font-mono">₦{player.balance.toLocaleString()}</span>
          </div>
        </div>

        {/* Tab 1: 1-on-1 Private Direct Chat */}
        {activeTab === 'dm' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/40">
            {/* Direct Chat Partner Header */}
            {selectedFriend ? (
              <div className="p-3 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow relative"
                    style={{ backgroundColor: selectedFriend.avatarColor }}
                  >
                    {selectedFriend.username.charAt(0).toUpperCase()}
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-white">{selectedFriend.username}</span>
                      <span className="text-xs text-sky-400 font-mono">{selectedFriend.handle}</span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{selectedFriend.status}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action: Send Money ₦ */}
                <button
                  onClick={() => openSendMoneyForFriend(selectedFriend)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition-all"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Send ₦ Money</span>
                </button>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400 border-b border-slate-800">
                Please select a contact from the Contacts tab to start a private chat.
              </div>
            )}

            {/* Private Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentDirectMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-400">
                  <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-sky-400 mb-1">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <div className="text-sm font-bold text-slate-200">
                    Private Chat with {selectedFriend?.username || 'Player'}
                  </div>
                  <p className="text-xs max-w-xs text-slate-400">
                    Messages and money transfers here are completely private between only you and{' '}
                    {selectedFriend?.username}.
                  </p>
                  <button
                    onClick={() => selectedFriend && openSendMoneyForFriend(selectedFriend)}
                    className="mt-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-emerald-500/40 cursor-pointer"
                  >
                    Send ₦50,000 Welcome Gift
                  </button>
                </div>
              ) : (
                currentDirectMessages.map((msg) => {
                  const isMe = msg.sender === player.username;

                  // Render Official Money Transfer Receipt Card
                  if (msg.isTransferReceipt) {
                    return (
                      <div
                        key={msg.id}
                        className={`flex justify-center my-3 animate-in zoom-in-95 duration-150`}
                      >
                        <div className="w-full max-w-sm rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/60 p-4 shadow-xl text-xs space-y-2.5">
                          <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
                            <div className="flex items-center gap-1.5 text-emerald-400 font-black">
                              <Receipt className="w-4 h-4" />
                              <span>DELTA BANK TRANSFER RECEIPT</span>
                            </div>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full">
                              SUCCESS
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Amount Sent:</span>
                            <span className="text-base font-black text-emerald-400 font-mono">
                              ₦{(msg.transferAmount || 0).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Recipient:</span>
                            <span className="text-white font-bold">{msg.recipientHandle || selectedFriend?.handle}</span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>Ref: {msg.refNumber || 'DLTA-' + Math.floor(100000 + Math.random() * 900000)}</span>
                            <span>{msg.timestamp}</span>
                          </div>

                          <p className="text-[11px] text-slate-300 italic pt-1 border-t border-slate-800">
                            "{msg.text}"
                          </p>
                        </div>
                      </div>
                    );
                  }

                  // Standard 1-on-1 Private Chat Bubble
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow"
                        style={{ backgroundColor: msg.avatarColor || (isMe ? player.skinTone : '#3b82f6') }}
                      >
                        {msg.sender.charAt(0).toUpperCase()}
                      </div>
                      <div
                        className={`max-w-[78%] rounded-2xl p-3 text-xs shadow-md ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 mb-1 font-semibold">
                          <span>{msg.sender}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input Toolbar */}
            {selectedFriend && (
              <form
                onSubmit={handleSendPrivateMessage}
                className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => openSendMoneyForFriend(selectedFriend)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 cursor-pointer transition-colors"
                  title="Send Money"
                >
                  <DollarSign className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Private message to @${selectedFriend.username}...`}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white cursor-pointer shadow-md transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Contacts List & Add Any User by Username */}
        {activeTab === 'contacts' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Add Friend / User Form */}
            <form onSubmit={handleAddFriendSubmit} className="space-y-2 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              <label className="block text-xs font-bold text-slate-200">
                Start Private Chat or Add Friend Through Username:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={newFriendInput}
                    onChange={(e) => setNewFriendInput(e.target.value)}
                    placeholder="Enter any player username (e.g. @ChiefOdogwu, @Amane, @WarriDon)"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add / Chat</span>
                </button>
              </div>
            </form>

            {/* List of Contacts */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 px-1">Your Delta State Contacts:</div>
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    selectedFriend?.id === friend.id
                      ? 'bg-slate-800/90 border-sky-500 shadow-md'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                  }`}
                  onClick={() => {
                    setSelectedFriend(friend);
                    setActiveTab('dm');
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm relative"
                      style={{ backgroundColor: friend.avatarColor }}
                    >
                      {friend.username.charAt(0).toUpperCase()}
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                          friend.isOnline ? 'bg-emerald-400' : 'bg-slate-500'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="font-black text-xs text-white flex items-center gap-1.5">
                        <span>{friend.username}</span>
                        <span className="text-[10px] text-slate-400 font-mono font-normal">
                          {friend.handle}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">{friend.status}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openSendMoneyForFriend(friend);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Send ₦</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFriend(friend);
                        setActiveTab('dm');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer shadow"
                    >
                      Private Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Dedicated Send Money to Anyone in Delta State */}
        {activeTab === 'transfer' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-600/40 p-4 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                    Delta Bank Direct Wire
                  </div>
                  <h3 className="text-lg font-black text-white">Send Money to Anyone</h3>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Available Balance</div>
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    ₦{player.balance.toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-300">
                Instantly transfer funds to any player in Warri, Asaba, or Delta State. Funds are credited
                instantly and an official bank receipt is generated in your private chat.
              </p>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Recipient Username or Handle:
                </label>
                <input
                  type="text"
                  value={transferTargetHandle}
                  onChange={(e) => setTransferTargetHandle(e.target.value)}
                  placeholder="e.g. @blakchase, @Amane, @ChiefDon"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Amount in Naira (₦):
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-base font-black text-emerald-400">₦</span>
                  <input
                    type="number"
                    value={transferAmountInput}
                    onChange={(e) => setTransferAmountInput(e.target.value)}
                    placeholder="50000"
                    min="1000"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-lg font-black font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Quick Amount Chips */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {[10000, 50000, 100000, 500000, 1000000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setTransferAmountInput(amt.toString())}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-emerald-400 cursor-pointer"
                    >
                      +₦{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Transfer Note / Memo:
                </label>
                <input
                  type="text"
                  value={transferMemo}
                  onChange={(e) => setTransferMemo(e.target.value)}
                  placeholder="e.g. Housewarming gift, Club Empire drinks"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-[0.99] transition-all"
              >
                <DollarSign className="w-5 h-5" />
                <span>Send ₦{parseInt(transferAmountInput || '0', 10).toLocaleString()} Now</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Pop-up Send Money Modal (when clicked from DM header) */}
      {isSendMoneyModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/60 rounded-3xl shadow-2xl p-5 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600/30 flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base">Send Money to {transferTargetHandle}</h3>
              </div>
              <button
                onClick={() => setIsSendMoneyModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Your Current Balance:</span>
              <span className="text-emerald-400 font-mono font-bold">₦{player.balance.toLocaleString()}</span>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Amount (₦):</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-emerald-400">₦</span>
                  <input
                    type="number"
                    value={transferAmountInput}
                    onChange={(e) => setTransferAmountInput(e.target.value)}
                    min="1000"
                    className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[20000, 50000, 100000, 250000].map((quick) => (
                    <button
                      type="button"
                      key={quick}
                      onClick={() => setTransferAmountInput(quick.toString())}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-emerald-400 border border-slate-700 cursor-pointer"
                    >
                      +₦{quick.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Note / Description:</label>
                <input
                  type="text"
                  value={transferMemo}
                  onChange={(e) => setTransferMemo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSendMoneyModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1 cursor-pointer shadow-lg"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Confirm Transfer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// src/features/profile/screens/ChatSupportScreen.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, MoreVertical, Play, Plus, Mic, Send } from 'lucide-react-native';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { selectUser } from '../../auth/store/authSlice';
import { useCreateTicketMutation } from '../../orders/api/orderApi';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const CHAT_PARTNER = {
  name: 'Angie Brekke',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
  status: 'Online',
};

const INITIAL_MESSAGES = [
  {
    id: '1',
    sender: 'angie',
    senderName: CHAT_PARTNER.name,
    senderAvatar: CHAT_PARTNER.avatar,
    type: 'text',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '08:04 pm',
  },
  {
    id: '2',
    sender: 'user',
    senderName: 'Esther Howard',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    type: 'text',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '08:04 pm',
  },
  {
    id: '3',
    sender: 'angie',
    senderName: CHAT_PARTNER.name,
    senderAvatar: CHAT_PARTNER.avatar,
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop',
    time: '08:04 pm',
  },
  {
    id: '4',
    sender: 'user',
    senderName: 'Esther Howard',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    type: 'audio',
    duration: '0:13',
    time: '08:04 pm',
  },
];

const ChatSupportScreen = () => {
  const navigation = useNavigation();
  const currentUser = useAppSelector(selectUser);
  const flatListRef = useRef(null);

  const [createTicket] = useCreateTicketMutation();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Sync user info from Redux store if available
  const userDisplayName = currentUser?.name || 'Esther Howard';
  const userAvatarUrl = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop';

  useEffect(() => {
    // Scroll to bottom on load
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const messageText = inputText.trim();

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      senderName: userDisplayName,
      senderAvatar: userAvatarUrl,
      type: 'text',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Trigger ticket creation in backend order-service DB
    try {
      await createTicket({
        userId: currentUser?._id || `user_${Date.now()}`,
        userName: userDisplayName,
        userEmail: currentUser?.email || 'customer@fashionstore.com',
        subject: `Support Chat: ${messageText.slice(0, 35)}...`,
        category: 'general',
        priority: 'medium',
        message: messageText,
      }).unwrap();
    } catch (err) {
      console.log('[Support Ticket API] Call logged:', err?.message || err);
    }

    // Auto scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate agent typing and replying
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const agentReply = {
        id: (Date.now() + 1).toString(),
        sender: 'angie',
        senderName: CHAT_PARTNER.name,
        senderAvatar: CHAT_PARTNER.avatar,
        type: 'text',
        text: 'Thank you for reaching out! Your support ticket has been created and our team is reviewing it.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase(),
      };
      setMessages((prev) => [...prev, agentReply]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Order Issue');
  const [ticketPriority, setTicketPriority] = useState('normal');
  const [ticketDescription, setTicketDescription] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  const handleCreateTicketSubmit = async () => {
    if (!ticketSubject.trim() || !ticketDescription.trim()) return;
    setIsSubmittingTicket(true);

    try {
      await createTicket({
        userId: currentUser?._id || `user_${Date.now()}`,
        userName: userDisplayName,
        userEmail: currentUser?.email || 'customer@fashionstore.com',
        subject: ticketSubject.trim(),
        category: ticketCategory.toLowerCase(),
        priority: ticketPriority,
        message: ticketDescription.trim(),
      }).unwrap();

      const userMessage = {
        id: Date.now().toString(),
        sender: 'user',
        senderName: userDisplayName,
        senderAvatar: userAvatarUrl,
        type: 'text',
        text: `🎫 [SUPPORT TICKET CREATED]\nSubject: ${ticketSubject.trim()}\nCategory: ${ticketCategory}\nDetails: ${ticketDescription.trim()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setTicketSubject('');
      setTicketDescription('');
      setIsTicketModalOpen(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const agentReply = {
          id: (Date.now() + 1).toString(),
          sender: 'angie',
          senderName: CHAT_PARTNER.name,
          senderAvatar: CHAT_PARTNER.avatar,
          type: 'text',
          text: `Thank you! Your ticket "${ticketSubject.trim()}" has been submitted to our support team and is logged on the Super Admin Dashboard.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase(),
        };
        setMessages((prev) => [...prev, agentReply]);
      }, 1200);
    } catch (err) {
      console.log('[Create Ticket Error]', err);
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const renderMessageItem = ({ item }) => {
    const isMe = item.sender === 'user';

    return (
      <View style={[styles.messageRow, isMe ? styles.rowRight : styles.rowLeft]}>
        {/* Bubble contents */}
        {item.type === 'text' && (
          <View style={[styles.bubble, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
            <Text style={[styles.messageText, isMe ? styles.textRight : styles.textLeft]}>
              {item.text}
            </Text>
          </View>
        )}

        {item.type === 'image' && (
          <View style={styles.imageBubble}>
            <Image source={{ uri: item.imageUrl }} style={styles.chatImage} />
          </View>
        )}

        {item.type === 'audio' && (
          <View style={[styles.audioBubble, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
            <TouchableOpacity style={styles.playButton}>
              <Play size={14} color={isMe ? colors.primary : colors.white} fill={isMe ? colors.primary : colors.white} />
            </TouchableOpacity>
            
            <View style={styles.waveformContainer}>
              {[8, 16, 24, 12, 20, 28, 14, 18, 22, 10, 16, 26, 12, 18, 8, 20, 14, 10, 16, 8].map((height, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveBar,
                    {
                      height: height * 0.7,
                      backgroundColor: isMe ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.3)',
                    },
                  ]}
                />
              ))}
            </View>
            
            <Text style={styles.audioDuration}>{item.duration}</Text>
          </View>
        )}

        {/* Sender and Time row */}
        {!isMe ? (
          <View style={styles.metaRowLeft}>
            <View style={styles.senderContainer}>
              <Image source={{ uri: item.senderAvatar }} style={styles.miniAvatar} />
              <Text style={styles.senderNameText}>{item.senderName}</Text>
            </View>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        ) : (
          <View style={styles.metaRowRight}>
            <Text style={styles.timeText}>{item.time}</Text>
            <View style={styles.senderContainer}>
              <Text style={styles.senderNameText}>{item.senderName}</Text>
              <Image source={{ uri: isMe ? userAvatarUrl : item.senderAvatar }} style={styles.miniAvatar} />
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header section matching exact layout */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerCircleBtn}>
          <ArrowLeft size={20} color="#000000" />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Image source={{ uri: CHAT_PARTNER.avatar }} style={styles.headerAvatar} />
          <View style={styles.nameStatus}>
            <Text style={styles.partnerName}>{CHAT_PARTNER.name}</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusIndicator} />
              <Text style={styles.statusText}>{CHAT_PARTNER.status}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.headerTicketBtn}
          onPress={() => setIsTicketModalOpen(true)}
        >
          <Plus size={14} color="#704F38" />
          <Text style={styles.headerTicketBtnText}>Ticket</Text>
        </TouchableOpacity>
      </View>

      {/* Main chat body with overlapping curved shape */}
      <View style={styles.chatBody}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={{ marginBottom: 12 }}>
              {/* Formal Ticket Creation Banner */}
              <TouchableOpacity 
                style={styles.createTicketBanner}
                onPress={() => setIsTicketModalOpen(true)}
                activeOpacity={0.85}
              >
                <View style={styles.bannerLeft}>
                  <View style={styles.bannerIconCircle}>
                    <Plus size={16} color="#704F38" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bannerTitle}>Need official help?</Text>
                    <Text style={styles.bannerSub}>Create a ticket for returns, refunds or order issues</Text>
                  </View>
                </View>
                <View style={styles.bannerPill}>
                  <Text style={styles.bannerPillText}>+ Create Ticket</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.dateHeader}>
                <Text style={styles.dateHeaderText}>TODAY</Text>
              </View>
            </View>
          )}
          ListFooterComponent={() =>
            isTyping ? (
              <View style={styles.typingIndicatorContainer}>
                <Image source={{ uri: CHAT_PARTNER.avatar }} style={styles.miniAvatar} />
                <Text style={styles.typingText}>Angie is typing</Text>
                <ActivityIndicator size="small" color={colors.textMuted} style={{ marginLeft: 6 }} />
              </View>
            ) : null
          }
        />

        {/* Input area matching exact screenshot layout */}
        <View style={styles.inputArea}>
          <TouchableOpacity 
            style={styles.plusButton}
            onPress={() => setIsTicketModalOpen(true)}
          >
            <Plus size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message here..."
              placeholderTextColor={colors.textMuted}
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
          </View>

          <TouchableOpacity
            style={styles.micSendButton}
            onPress={inputText.trim() ? handleSend : null}
          >
            {inputText.trim() ? (
              <Send size={18} color={colors.white} />
            ) : (
              <Mic size={18} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Ticket Creation Modal */}
      <Modal
        visible={isTicketModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsTicketModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎫 Raise Support Ticket</Text>
              <TouchableOpacity onPress={() => setIsTicketModalOpen(false)}>
                <Text style={styles.modalCloseBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Subject / Issue Title</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Issue with Order #ORD-1002"
                value={ticketSubject}
                onChangeText={setTicketSubject}
              />

              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.chipRow}>
                {['Order Issue', 'Refund', 'Return', 'Exchange', 'General'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setTicketCategory(cat)}
                    style={[
                      styles.chip,
                      ticketCategory === cat && styles.chipActive,
                    ]}
                  >
                    <Text style={[styles.chipText, ticketCategory === cat && styles.chipTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Priority Level</Text>
              <View style={styles.chipRow}>
                {['normal', 'high', 'urgent'].map((prio) => (
                  <TouchableOpacity
                    key={prio}
                    onPress={() => setTicketPriority(prio)}
                    style={[
                      styles.chip,
                      ticketPriority === prio && styles.chipActive,
                    ]}
                  >
                    <Text style={[styles.chipText, ticketPriority === prio && styles.chipTextActive]}>
                      {prio.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Details / Message</Text>
              <TextInput
                style={[styles.modalInput, { height: 90, textAlignVertical: 'top' }]}
                multiline
                numberOfLines={4}
                placeholder="Describe your issue in detail..."
                value={ticketDescription}
                onChangeText={setTicketDescription}
              />

              <TouchableOpacity
                style={[
                  styles.submitTicketBtn,
                  (!ticketSubject.trim() || !ticketDescription.trim()) && styles.btnDisabled,
                ]}
                disabled={!ticketSubject.trim() || !ticketDescription.trim() || isSubmittingTicket}
                onPress={handleCreateTicketSubmit}
              >
                {isSubmittingTicket ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitTicketBtnText}>Submit Support Ticket</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#704F38', // Dark brown header background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingTop: Platform.OS === 'ios' ? spacing[14] : spacing[10],
    paddingBottom: spacing[10],
  },
  headerCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  nameStatus: {
    justifyContent: 'center',
  },
  partnerName: {
    ...textStyles.body1,
    fontWeight: '700',
    color: colors.white,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50', // Green online dot
  },
  statusText: {
    fontSize: 11,
    color: '#E0D4C9', // Light tan status
    fontWeight: '500',
  },
  chatBody: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Beautiful soft off-white background
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    overflow: 'hidden',
  },
  listContent: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[8],
  },
  dateHeader: {
    alignItems: 'center',
    marginVertical: spacing[4],
  },
  dateHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#A0A1AB',
  },
  messageRow: {
    marginBottom: spacing[5],
    maxWidth: '85%',
  },
  rowLeft: {
    alignSelf: 'flex-start',
  },
  rowRight: {
    alignSelf: 'flex-end',
  },
  bubble: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  bubbleLeft: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 4,
    borderColor: '#ECECEC',
    borderWidth: 1,
  },
  bubbleRight: {
    backgroundColor: '#704F38', // Primary brand color bubble
    borderTopRightRadius: 4,
  },
  messageText: {
    ...textStyles.body1,
    lineHeight: 20,
  },
  textLeft: {
    color: colors.text,
  },
  textRight: {
    color: colors.white,
  },
  imageBubble: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ECECEC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  chatImage: {
    width: 260,
    height: 170,
    resizeMode: 'cover',
  },
  audioBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: spacing[3],
    width: 260,
    gap: spacing[3],
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 32,
  },
  waveBar: {
    width: 2.5,
    borderRadius: 1.25,
  },
  audioDuration: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  metaRowLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 260,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  metaRowRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 260,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  senderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  senderNameText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#797979',
  },
  timeText: {
    fontSize: 11,
    color: '#A0A1AB',
  },
  typingIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
    marginBottom: spacing[2],
  },
  typingText: {
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 6,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    gap: spacing[3],
    paddingBottom: Platform.OS === 'ios' ? spacing[6] : spacing[4],
  },
  plusButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 22,
    paddingHorizontal: spacing[4],
    height: 44,
    justifyContent: 'center',
  },
  textInput: {
    ...textStyles.body1,
    color: colors.text,
    padding: 0, // Reset default padding
  },
  micSendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#704F38', // Brand brown color button
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#704F38',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTicketBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerTicketBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#704F38',
  },
  createTicketBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 8,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  bannerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDFBF9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2029',
  },
  bannerSub: {
    fontSize: 10,
    fontWeight: '500',
    color: '#797979',
    marginTop: 2,
  },
  bannerPill: {
    backgroundColor: '#704F38',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bannerPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2029',
  },
  modalCloseBtn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#797979',
    padding: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#704F38',
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#F9F9FB',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2029',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: '#704F38',
    borderColor: '#704F38',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  submitTicketBtn: {
    backgroundColor: '#704F38',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  submitTicketBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
});

export default ChatSupportScreen;

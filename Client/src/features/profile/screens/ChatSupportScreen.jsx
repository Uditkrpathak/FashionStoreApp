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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, MoreVertical, Play, Plus, Mic, Send } from 'lucide-react-native';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import { selectUser } from '../../auth/store/authSlice';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';
import { useGetMyTicketQuery, useReplyMyTicketMutation } from '../store/userApi';

const CHAT_PARTNER = {
  name: 'Angie Brekke',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
  status: 'Online',
};

const ChatSupportScreen = () => {
  const navigation = useNavigation();
  const currentUser = useAppSelector(selectUser);
  const flatListRef = useRef(null);

  const [inputText, setInputText] = useState('');

  // Fetch support ticket thread from DB
  const { data: ticketData, refetch, isLoading } = useGetMyTicketQuery(undefined, {
    pollingInterval: 4000, // Poll every 4 seconds for new messages
  });
  const [replyMyTicket, { isLoading: isReplying }] = useReplyMyTicketMutation();

  const userDisplayName = currentUser?.name || 'Customer';
  const userAvatarUrl = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop';

  const ticket = ticketData?.ticket;
  
  // Transform messages to local presentation format
  const messages = (ticket?.messages || []).map((msg, index) => {
    const isMe = msg.sender === 'customer';
    return {
      id: index.toString(),
      sender: isMe ? 'user' : 'angie',
      senderName: isMe ? userDisplayName : CHAT_PARTNER.name,
      senderAvatar: isMe ? userAvatarUrl : CHAT_PARTNER.avatar,
      type: 'text',
      text: msg.text,
      time: (() => {
        const d = new Date(msg.timestamp);
        if (isNaN(d.getTime())) return '';
        let hours = d.getHours();
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
      })(),
    };
  });

  useEffect(() => {
    // Scroll to bottom on initial message load
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages.length]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const textToSend = inputText.trim();
    setInputText('');

    try {
      await replyMyTicket(textToSend).unwrap();
      refetch();
    } catch (err) {
      alert(err.data?.message || 'Failed to send message');
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
          <ArrowLeft size={20} color={colors.text} />
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

        <TouchableOpacity style={styles.headerCircleBtn}>
          <MoreVertical size={20} color={colors.text} />
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
            <View style={styles.dateHeader}>
              <Text style={styles.dateHeaderText}>TODAY</Text>
            </View>
          )}
          ListFooterComponent={() =>
            isReplying ? (
              <View style={styles.typingIndicatorContainer}>
                <Text style={styles.typingText}>Sending message...</Text>
                <ActivityIndicator size="small" color={colors.textMuted} style={{ marginLeft: 6 }} />
              </View>
            ) : null
          }
        />

        {/* Input area matching exact screenshot layout */}
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.plusButton}>
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
    paddingBottom: 80,
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
});

export default ChatSupportScreen;

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonFooter,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonTextarea,
  IonActionSheet,
  IonList,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  addCircleOutline, 
  send, 
  micOutline, 
  documentOutline, 
  imageOutline, 
  cameraOutline, 
  locationOutline,
  menuOutline,
  addOutline
} from 'ionicons/icons';

interface Message {
  id: string;
  text: string;
  formattedText?: SafeHtml;
  type: 'sent' | 'received';
  time: string;
  followUpQuestions?: string[];
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
  messages: Message[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.page.html',
  styleUrls: ['chat.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonFooter,
    IonButton,
    IonButtons,
    IonIcon,
    IonItem,
    IonTextarea,
    IonActionSheet,
    IonList,
    IonSpinner
  ],
})
export class ChatPage {
  messageText: string = '';
  showAttachmentOptions: boolean = false;
  sidebarOpen: boolean = false;
  currentConversation: Conversation | null = null;
  currentMessages: Message[] = [];
  isAiTyping: boolean = false;

  // Gemini API configuration
  private GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
  private GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  // Sample conversation data with Indian financial themes
  todayConversations: Conversation[] = [
    {
      id: '1',
      title: 'PM Kisan Yojana',
      lastMessage: 'How can I apply for PM Kisan scheme?',
      time: '2:30 PM',
      messages: []
    },
    {
      id: '2',
      title: 'SIP Investment Guide',
      lastMessage: 'Best SIP options for beginners in India?',
      time: '11:45 AM',
      messages: []
    }
  ];

  yesterdayConversations: Conversation[] = [
    {
      id: '3',
      title: 'ELSS Tax Saving',
      lastMessage: 'Which ELSS funds are best for tax saving?',
      time: 'Yesterday',
      messages: []
    },
    {
      id: '4',
      title: 'Atal Pension Yojana',
      lastMessage: 'How to enroll in APY scheme?',
      time: 'Yesterday',
      messages: []
    }
  ];

  thisWeekConversations: Conversation[] = [
    {
      id: '5',
      title: 'GST for Small Business',
      lastMessage: 'GST registration process for startups',
      time: 'Monday',
      messages: []
    },
    {
      id: '6',
      title: 'Home Loan Planning',
      lastMessage: 'Best home loan rates in India 2024',
      time: 'Tuesday',
      messages: []
    }
  ];

  attachmentButtons = [
    {
      text: 'Document',
      icon: 'document-outline',
      handler: () => {
        this.attachDocument();
      }
    },
    {
      text: 'Camera',
      icon: 'camera-outline',
      handler: () => {
        this.openCamera();
      }
    },
    {
      text: 'Gallery',
      icon: 'image-outline',
      handler: () => {
        this.openGallery();
      }
    },
    {
      text: 'Location',
      icon: 'location-outline',
      handler: () => {
        this.shareLocation();
      }
    },
    {
      text: 'Cancel',
      role: 'cancel'
    }
  ];

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    addIcons({ 
      addCircleOutline, 
      send, 
      micOutline, 
      documentOutline, 
      imageOutline, 
      cameraOutline, 
      locationOutline,
      menuOutline,
      addOutline
    });

    // Start with the default AI chat conversation
    this.initializeDefaultChat();
  }

  private initializeDefaultChat() {
    // Create default conversation that's not added to history yet
    this.currentConversation = {
      id: 'default-chat',
      title: 'Financial Assistant',
      lastMessage: '',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: []
    };
    
    this.initializeAiChat();
  }

  initializeAiChat() {
    const welcomeMessage: Message = {
      id: '1',
      text: 'नमस्ते! I\'m your Indian Financial Assistant. I can help you with government schemes, investment advice, tax planning, and financial decisions specific to India. How can I assist you today?',
      formattedText: this.formatText('नमस्ते! I\'m your Indian Financial Assistant. I can help you with government schemes, investment advice, tax planning, and financial decisions specific to India. How can I assist you today?'),
      type: 'received',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      followUpQuestions: [
        'Tell me about PM Kisan Yojana',
        'Best SIP plans for beginners',
        'How to save tax under 80C?',
        'Latest government schemes for farmers'
      ]
    };
    this.currentMessages = [welcomeMessage];
    
    if (this.currentConversation) {
      this.currentConversation.messages = [welcomeMessage];
    }
  }

  // Text formatting function to convert markdown-like syntax to HTML
  private formatText(text: string): SafeHtml {
    let formattedText = text;

    // Convert **bold** to <strong>
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to <em>
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert bullet points (- item or • item)
    formattedText = formattedText.replace(/^[\-•]\s+(.+)$/gm, '<li>$1</li>');
    
    // Convert numbered lists (1. item)
    formattedText = formattedText.replace(/^\d+\.\s+(.+)$/gm, '<li class="numbered">$1</li>');
    
    // Wrap consecutive list items in ul tags
    formattedText = formattedText.replace(/(<li>.*?<\/li>)(\n<li>.*?<\/li>)*/gs, (match) => {
      if (match.includes('class="numbered"')) {
        return '<ol>' + match.replace(/\n/g, '') + '</ol>';
      } else {
        return '<ul>' + match.replace(/\n/g, '') + '</ul>';
      }
    });
    
    // Convert line breaks to <br>
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    // Convert amount formatting (₹1,00,000 or Rs. 50,000)
    formattedText = formattedText.replace(/(₹|Rs\.?\s?)(\d+(?:,\d+)*(?:\.\d{2})?)/g, '<span class="amount">$1$2</span>');
    
    // Convert percentage formatting
    formattedText = formattedText.replace(/(\d+(?:\.\d+)?)%/g, '<span class="percentage">$1%</span>');
    
    // Convert scheme names to highlight (words ending with "Yojana" or "Scheme")
    formattedText = formattedText.replace(/([A-Za-z\s]+(?:Yojana|Scheme|Fund|Plan))/g, '<span class="scheme-name">$1</span>');

    return this.sanitizer.bypassSecurityTrustHtml(formattedText);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  selectConversation(conversation: Conversation) {
    this.currentConversation = conversation;
    this.currentMessages = [...conversation.messages];
    this.closeSidebar();
  }

  startNewChat() {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Financial Chat',
      lastMessage: '',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: []
    };
    
    this.currentConversation = newConversation;
    this.currentMessages = [];
    this.initializeAiChat();
    this.closeSidebar();
  }

  sendMessage() {
    if (this.messageText.trim().length === 0) {
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: this.messageText,
      formattedText: this.formatText(this.messageText),
      type: 'sent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.currentMessages.push(userMessage);
    
    if (this.currentConversation) {
      // If this is a new conversation (not in history yet), add it to today's conversations
      if (!this.isConversationInHistory(this.currentConversation.id)) {
        // Update conversation title based on first user message
        this.currentConversation.title = this.messageText.substring(0, 30) + (this.messageText.length > 30 ? '...' : '');
        this.currentConversation.lastMessage = this.messageText;
        this.currentConversation.time = userMessage.time;
        
        // Add to today's conversations at the beginning
        this.todayConversations.unshift({...this.currentConversation});
      }
      
      // Update the conversation in history
      this.updateConversationInHistory(this.currentConversation.id, userMessage);
      
      // Update current conversation
      this.currentConversation.messages.push(userMessage);
      this.currentConversation.lastMessage = this.messageText;
      this.currentConversation.time = userMessage.time;
    }

    const messageToSend = this.messageText;
    this.messageText = '';
    
    // Call Gemini AI for response
    this.getAiResponse(messageToSend);
  }

  private isConversationInHistory(conversationId: string): boolean {
    return this.todayConversations.some(conv => conv.id === conversationId) ||
           this.yesterdayConversations.some(conv => conv.id === conversationId) ||
           this.thisWeekConversations.some(conv => conv.id === conversationId);
  }

  private updateConversationInHistory(conversationId: string, message: Message) {
    // Update in today's conversations
    const todayIndex = this.todayConversations.findIndex(conv => conv.id === conversationId);
    if (todayIndex !== -1) {
      this.todayConversations[todayIndex].messages.push(message);
      this.todayConversations[todayIndex].lastMessage = message.text;
      this.todayConversations[todayIndex].time = message.time;
      
      // Move to top of today's list
      const updatedConv = this.todayConversations.splice(todayIndex, 1)[0];
      this.todayConversations.unshift(updatedConv);
      return;
    }

    // Update in yesterday's conversations
    const yesterdayIndex = this.yesterdayConversations.findIndex(conv => conv.id === conversationId);
    if (yesterdayIndex !== -1) {
      this.yesterdayConversations[yesterdayIndex].messages.push(message);
      this.yesterdayConversations[yesterdayIndex].lastMessage = message.text;
      this.yesterdayConversations[yesterdayIndex].time = message.time;
      return;
    }

    // Update in this week's conversations
    const weekIndex = this.thisWeekConversations.findIndex(conv => conv.id === conversationId);
    if (weekIndex !== -1) {
      this.thisWeekConversations[weekIndex].messages.push(message);
      this.thisWeekConversations[weekIndex].lastMessage = message.text;
      this.thisWeekConversations[weekIndex].time = message.time;
    }
  }

  private getAiResponse(message: string) {
    this.isAiTyping = true;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const requestBody = {
      contents: [{
        parts: [{
          text: `You are an Indian Financial Assistant. Provide helpful, accurate advice about Indian government schemes, financial planning, investments, taxes, and banking specific to India. 

User question: ${message}

Please provide:
1. A clear, well-formatted response (maximum 150 words)
2. Use formatting for better readability:
   - Use **bold** for important terms and amounts
   - Use bullet points (- ) for lists
   - Use numbered lists (1. ) for steps
   - Highlight percentages and amounts clearly
3. Three relevant follow-up questions the user might ask

Format your response like this:
RESPONSE: [Your main response here with proper formatting]

FOLLOW_UP_QUESTIONS:
1. [Question 1]
2. [Question 2] 
3. [Question 3]

Focus on Indian context: RBI guidelines, Indian tax laws, government schemes, Indian stock market, rupee-based calculations, etc.

Example formatting:
**PM Kisan Yojana** provides ₹6,000 annually to farmers:
- Eligibility: Small and marginal farmers
- Payment: ₹2,000 every 4 months  
- Tax: Exempt under **80C**

Steps to apply:
1. Visit PM Kisan portal
2. Register with Aadhaar
3. Submit land documents`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7
      }
    };

    const apiUrl = `${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`;

    this.http.post<GeminiResponse>(apiUrl, requestBody, { headers })
      .subscribe({
        next: (response) => {
          this.isAiTyping = false;
          
          if (response.candidates && response.candidates.length > 0) {
            const aiResponseText = response.candidates[0].content.parts[0].text;
            this.parseAiResponse(aiResponseText);
          }
        },
        error: (error) => {
          this.isAiTyping = false;
          const errorMessage: Message = {
            id: Date.now().toString(),
            text: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
            formattedText: this.formatText('Sorry, I\'m having trouble connecting right now. Please try again in a moment.'),
            type: 'received',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          this.currentMessages.push(errorMessage);
          this.updateCurrentConversationWithAiMessage(errorMessage);
          console.error('Gemini API Error:', error);
        }
      });
  }

  private parseAiResponse(responseText: string) {
    let mainResponse = responseText;
    let followUpQuestions: string[] = [];

    // Parse the structured response
    if (responseText.includes('RESPONSE:') && responseText.includes('FOLLOW_UP_QUESTIONS:')) {
      const parts = responseText.split('FOLLOW_UP_QUESTIONS:');
      mainResponse = parts[0].replace('RESPONSE:', '').trim();
      
      const questionsText = parts[1];
      const questionLines = questionsText.split('\n').filter(line => line.trim().match(/^\d+\./));
      followUpQuestions = questionLines.map(line => line.replace(/^\d+\.\s*/, '').trim()).filter(q => q.length > 0);
    }

    const aiMessage: Message = {
      id: Date.now().toString(),
      text: mainResponse,
      formattedText: this.formatText(mainResponse),
      type: 'received',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      followUpQuestions: followUpQuestions.length > 0 ? followUpQuestions : undefined
    };

    this.currentMessages.push(aiMessage);
    this.updateCurrentConversationWithAiMessage(aiMessage);
  }

  private updateCurrentConversationWithAiMessage(aiMessage: Message) {
    if (this.currentConversation) {
      // Update current conversation
      this.currentConversation.messages.push(aiMessage);
      this.currentConversation.lastMessage = aiMessage.text.substring(0, 50) + '...';
      this.currentConversation.time = aiMessage.time;

      // Update in history if it exists
      this.updateConversationInHistory(this.currentConversation.id, aiMessage);
    }
  }

  sendFollowUpQuestion(question: string) {
    this.messageText = question;
    this.sendMessage();
  }

  onKeyPress(event: any) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  openAttachmentOptions() {
    this.showAttachmentOptions = true;
  }

  startVoiceRecording() {
    console.log('Starting voice recording...');
    // TODO: Implement voice recording logic
  }

  attachDocument() {
    console.log('Attaching document...');
    // TODO: Implement document attachment logic
  }

  openCamera() {
    console.log('Opening camera...');
    // TODO: Implement camera functionality
  }

  openGallery() {
    console.log('Opening gallery...');
    // TODO: Implement gallery functionality
  }

  shareLocation() {
    console.log('Sharing location...');
    // TODO: Implement location sharing logic
  }
} 

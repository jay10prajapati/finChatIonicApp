import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonButton,
  IonSpinner,
  IonItem,
  IonLabel,
  IonTextarea,
  IonIcon,
  IonList
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { send, refresh } from 'ionicons/icons';

interface ApiResponse {
  id: string;
  name: string;
  data: {
    year: number;
    price: number;
    'CPU model': string;
    'Hard disk size': string;
  };
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent,
    IonButton,
    IonSpinner,
    IonItem,
    IonLabel,
    IonTextarea,
    IonIcon,
    IonList
  ],
})
export class HomePage implements OnInit {
  // API Test Data properties
  apiData: ApiResponse | null = null;
  loading: boolean = false;
  error: string | null = null;

  // Gemini Chat properties
  chatMessages: ChatMessage[] = [];
  userMessage: string = '';
  chatLoading: boolean = false;
  chatError: string | null = null;
  
  // Gemini API configuration
  private GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; // You'll update this later
  private GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(private http: HttpClient) {
    addIcons({ send, refresh });
  }

  ngOnInit() {
    this.fetchData();
    this.initializeChat();
  }

  // API Test Methods
  fetchData() {
    this.loading = true;
    this.error = null;

    this.http.get<ApiResponse>('https://api.restful-api.dev/objects/5')
      .subscribe({
        next: (data) => {
          this.apiData = data;
          this.loading = false;
          console.log('API Data:', data);
        },
        error: (error) => {
          this.error = 'Failed to fetch data from API';
          this.loading = false;
          console.error('API Error:', error);
        }
      });
  }

  refreshData() {
    this.fetchData();
  }

  // Gemini Chat Methods
  initializeChat() {
    const welcomeMessage: ChatMessage = {
      id: '1',
      text: 'Hello! I\'m your AI assistant. Ask me anything and I\'ll respond in one sentence.',
      isUser: false,
      timestamp: new Date()
    };
    this.chatMessages.push(welcomeMessage);
  }

  sendMessage() {
    if (this.userMessage.trim().length === 0) {
      return;
    }

    // Check if API key is set
    if (this.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      this.chatError = 'Gemini API key not configured. Please update the API key.';
      return;
    }

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: this.userMessage,
      isUser: true,
      timestamp: new Date()
    };
    this.chatMessages.push(userMsg);

    const messageToSend = this.userMessage;
    this.userMessage = '';
    this.chatLoading = true;
    this.chatError = null;

    // Call Gemini API
    this.callGeminiAPI(messageToSend);
  }

  private callGeminiAPI(message: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const requestBody = {
      contents: [{
        parts: [{
          text: `Please respond to this message in maximum 100 words. Reply should be in the same language as the message: ${message}`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 50,
        temperature: 0.7
      }
    };

    const apiUrl = `${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`;

    this.http.post<GeminiResponse>(apiUrl, requestBody, { headers })
      .subscribe({
        next: (response) => {
          this.chatLoading = false;
          
          if (response.candidates && response.candidates.length > 0) {
            const aiResponse = response.candidates[0].content.parts[0].text;
            
            const aiMessage: ChatMessage = {
              id: Date.now().toString(),
              text: aiResponse,
              isUser: false,
              timestamp: new Date()
            };
            this.chatMessages.push(aiMessage);
          } else {
            this.chatError = 'No response received from AI';
          }
        },
        error: (error) => {
          this.chatLoading = false;
          this.chatError = 'Failed to get AI response. Please check your API key and try again.';
          console.error('Gemini API Error:', error);
        }
      });
  }

  onKeyPress(event: any) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat() {
    this.chatMessages = [];
    this.initializeChat();
    this.chatError = null;
  }
} 

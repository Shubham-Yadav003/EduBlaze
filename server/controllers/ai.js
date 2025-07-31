import TryCatch from "../middlewares/tryCatch.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_API_URL = process.env.GEMINI_API_URL 

// Fallback responses for when AI service is unavailable
const getFallbackResponse = (message, userRole) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return `Hello! I'm your EduBlaze AI assistant. I'm here to help you with your learning journey. How can I assist you today?`;
  }
  
  if (lowerMessage.includes('course') || lowerMessage.includes('study')) {
    return `I can help you with course-related questions! You can browse available courses, track your progress, and access study materials. What specific course are you interested in?`;
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return `I'm here to help! I can assist with:
• Course navigation and content
• Study tips and learning strategies  
• Platform features and usage
• Technical support

What would you like help with?`;
  }
  
  if (lowerMessage.includes('thank')) {
    return `You're welcome! I'm glad I could help. Feel free to ask me anything else about your learning journey.`;
  }
  
  // Default response
  return `I understand you're asking about "${message}". While I'm experiencing some technical difficulties right now, I'm here to help with your EduBlaze learning platform. You can ask me about courses, study tips, platform features, or general learning support. What would you like to know?`;
};

export const askAI = TryCatch(async (req, res) => {
  const { message, courseContext } = req.body;
  const user = req.user;

  // Enhanced debug logging
  console.log("=== AI Request Debug ===");
  console.log("API Key present:", !!GEMINI_API_KEY);
  console.log("API Key length:", GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);
  console.log("API Key starts with:", GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 10) + "..." : "N/A");
  console.log("Message:", message);
  console.log("User:", user?.name);
  console.log("Environment variables:", {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    Jwt_Sec: !!process.env.Jwt_Sec,
    GEMINI_API_KEY_ENV: !!process.env.GEMINI_API_KEY
  });

  if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing!");
    return res.status(500).json({
      message: "AI service not configured. Please contact administrator.",
    });
  }

  if (!message || message.trim().length === 0) {
    return res.status(400).json({
      message: "Please provide a message to ask the AI",
    });
  }

  try {
    // Create a context-aware prompt for educational queries
    const systemPrompt = `You are an AI assistant for an educational platform called EduBlaze. You help students, teachers, and administrators with:

1. **Course-related questions**: Help with course content, assignments, and learning materials
2. **Technical support**: Assist with platform usage and navigation
3. **Learning guidance**: Provide study tips, learning strategies, and educational advice
4. **General queries**: Answer questions about the platform and education

Current user context:
- User type: ${user.role === "admin" ? "Admin" : user.mainrole === "superadmin" ? "Super Admin" : "Student"}
- Course context: ${courseContext || "General platform query"}

Please provide helpful, accurate, and educational responses. Keep responses concise but informative.`;

    const fullPrompt = `${systemPrompt}

User Question: ${message}

Please provide a helpful response:`;

    console.log("Sending request to Gemini API...");
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    console.log("✅ AI Response generated successfully");

    res.json({
      message: "AI response generated successfully",
      response: aiResponse,
    });
  } catch (error) {
    console.error("❌ Gemini API Error:", error.response?.data || error.message);
    
    // Check if it's a service overload error
    if (error.response?.data?.error?.status === 'UNAVAILABLE' || 
        error.response?.data?.error?.code === 503) {
      console.log("🔄 Using fallback response due to service overload");
      const fallbackResponse = getFallbackResponse(message, user.role);
      
      res.json({
        message: "AI response generated successfully (fallback mode)",
        response: fallbackResponse,
      });
    } else {
      console.error("Full error object:", error);
      res.status(500).json({
        message: "Failed to get AI response. Please try again later.",
      });
    }
  }
});

export const getAIContext = TryCatch(async (req, res) => {
  const { courseId } = req.query;
  const user = req.user;

  let context = {
    userType: user.role === "admin" ? "Admin" : user.mainrole === "superadmin" ? "Super Admin" : "Student",
    userName: user.name,
    availableFeatures: [],
  };

  // Add course-specific context if courseId is provided
  if (courseId) {
    try {
      const { Courses } = await import("../models/courses.js");
      const course = await Courses.findById(courseId);
      
      if (course) {
        context.courseInfo = {
          title: course.title,
          category: course.category,
          createdBy: course.createdBy,
        };
      }
    } catch (error) {
      console.error("Error fetching course context:", error);
    }
  }

  // Add user-specific features
  if (user.role === "admin" || user.mainrole === "superadmin") {
    context.availableFeatures.push("Course Management", "User Management", "Analytics");
  } else {
    context.availableFeatures.push("Course Learning", "Progress Tracking", "Study Materials");
  }

  res.json({
    message: "AI context retrieved successfully",
    context,
  });
}); 
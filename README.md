#  Quantum Heist

**Quantum Heist** is a cyberpunk-themed educational game that teaches quantum computing fundamentals through immersive role-based puzzles and AI-generated dynamic storytelling. Built with React, TypeScript, and Google Gemini AI.

---

## 🚀 Key Features

- 🎭 **Three Distinct Roles**  
  Choose your heist specialty:
  - **Hacker**: Build quantum circuits with drag-and-drop interface
  - **Analyst**: Examine quantum attack patterns and identify threats
  - **Strategist**: Manage resources and plan high-level approaches

- ⚛️ **Interactive Quantum Learning**  
  Master core concepts through hands-on puzzles:
  - Superposition & Measurement
  - Quantum Entanglement  
  - Grover's Algorithm
  - Circuit Analysis

- 🤖 **AI-Powered Experience**  
  - **LLM-as-Simulator**: Circuits converted to Qiskit code and executed via Gemini
  - **Dynamic Narrative**: Real-time story generation based on your actions
  - **Educational Explanations**: AI-generated learning content after each success

- 🔧 **Developer-Friendly**  
  - **Mock API Mode**: Full offline functionality without API key
  - **Type-Safe**: Complete TypeScript implementation
  - **Component-Based**: Clean, reusable React architecture

---

## 🎮 Gameplay Loop

1. **Role Selection** → Choose Hacker, Analyst, or Strategist
2. **Puzzle Engagement** → Solve quantum challenges using role-specific tools
3. **AI Simulation** → Your solution processed by Gemini for realistic results
4. **Dynamic Story** → Success/failure triggers AI-generated narrative consequences  
5. **Learn & Progress** → Understand quantum concepts and advance to next challenge

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | Type-safe, modern UI |
| **Styling** | Tailwind CSS + Custom CSS | Cyberpunk aesthetic with utility-first approach |
| **AI Service** | Google Gemini API | Circuit simulation & narrative generation |
| **State Management** | Custom React Hook | Centralized game logic |
| **Build Tool** | Vite | Fast development & optimized builds |
| **Quantum Sim** | Qiskit (LLM-generated) | Realistic quantum circuit behavior |

---

## 📁 Project Architecture

```
src/
├── components/
│   ├── App.tsx                 
│   ├── GameUI.tsx             
│   ├── CircuitBuilder.tsx     
│   ├── GatePanel.tsx          
│   ├── NarrativePanel.tsx     
│   └── DialogueScreen.tsx    
├── hooks/
│   └── useGameLogic.ts        
├── services/
│   └── geminiService.ts      
└── types/
    └── index.ts               
```

---

## 🔧 Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn
- Google Gemini API key (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/quantum-heist.git
cd quantum-heist

# Install dependencies
npm install

# Environment setup (optional)
cp .env.example .env.local
# Add: VITE_GEMINI_API_KEY=your_api_key_here

# Start development server
npm run dev
```

**🎯 No API Key?** The game includes comprehensive mocking - experience full functionality offline!

---

## 🧠 Educational Topics

- **Quantum Superposition** → Multiple simultaneous states
- **Quantum Entanglement** → Correlated particle behavior  
- **Quantum Gates** → Circuit building blocks
- **Grover's Algorithm** → Quantum search optimization
- **Measurement Theory** → State collapse and probability
- **Circuit Analysis** → Reading quantum circuit behavior

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/quantum-magic`)
3. **Commit** changes (`git commit -m 'Add quantum magic'`)
4. **Push** to branch (`git push origin feature/quantum-magic`)
5. **Open** Pull Request

### Development Guidelines
- Maintain TypeScript type safety
- Keep components focused and reusable  
- Add tests for new features
- Update documentation

---

## 🗺 Roadmap

- [ ] **Advanced Algorithms**: Shor's Algorithm, VQE
- [ ] **Multiplayer Mode**: Cooperative heist missions
- [ ] **Mobile Version**: Native iOS/Android apps
- [ ] **Classroom Tools**: Teacher dashboard and progress tracking
- [ ] **Achievement System**: Gamified learning progression

---

**Ready to start your quantum heist?** 🚀⚛️

*Combine cyberpunk adventure with quantum education - where learning meets excitement!*

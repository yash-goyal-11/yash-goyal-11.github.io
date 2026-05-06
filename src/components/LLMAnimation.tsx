import { useEffect, useRef, useState } from 'react'

interface Token {
  id: number
  text: string
  delay: number
}

const tokens: Token[] = [
  { id: 1, text: '▌', delay: 0 },
  { id: 2, text: 'token_embedding', delay: 0.1 },
  { id: 3, text: '[seq_len', delay: 0.2 },
  { id: 4, text: '=512]', delay: 0.3 },
  { id: 5, text: '→', delay: 0.4 },
  { id: 6, text: 'attention_heads', delay: 0.5 },
  { id: 7, text: '[8]', delay: 0.6 },
  { id: 8, text: '→', delay: 0.7 },
  { id: 9, text: 'output_logits', delay: 0.8 },
  { id: 10, text: '[vocab_size]', delay: 0.9 },
]

export function TokenStreamAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleTokens, setVisibleTokens] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setVisibleTokens((prev) => {
        if (prev.length >= tokens.length) {
          return []
        }
        return [...prev, prev.length]
      })
    }, 200)

    return () => clearInterval(interval)
  }, [isPlaying])

  const handleReset = () => {
    setVisibleTokens([])
    setIsPlaying(true)
  }

  return (
    <div
      ref={containerRef}
      className="space-y-2 rounded-lg border border-[#3cd0bd]/20 bg-[#0a1118]/50 p-4 backdrop-blur-sm cursor-pointer"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      <div className="flex items-center justify-between">
        <div className="text-[#64748b] text-xs">LLM Token Generation (Hover to pause)</div>
        <button
          onClick={handleReset}
          className="text-xs px-2 py-1 rounded bg-[#3cd0bd]/20 text-[#3cd0bd] hover:bg-[#3cd0bd]/40 transition-colors"
        >
          Replay
        </button>
      </div>
      <div className="flex flex-wrap gap-2 items-center min-h-[40px]">
        {visibleTokens.map((index) => (
          <span
            key={tokens[index].id}
            className="animate-pulse text-[#3cd0bd] font-semibold"
            style={{
              animation: `fadeInScale 0.3s ease-out`,
            }}
          >
            {tokens[index].text}
          </span>
        ))}
        {visibleTokens.length === 0 && (
          <span className="text-[#64748b] animate-pulse">initializing...</span>
        )}
      </div>
    </div>
  )
}

export function AgentThinkingAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStage, setCurrentStage] = useState(-1)
  const [logs, setLogs] = useState<string[]>([])

  const stages = [
    { label: 'context_parsing', icon: '📝', color: '#00b894' },
    { label: 'reasoning_loop', icon: '🧠', color: '#a29bfe' },
    { label: 'action_planning', icon: '📋', color: '#3cd0bd' },
    { label: 'execution', icon: '⚡', color: '#ffd93d' },
    { label: 'evaluation', icon: '✅', color: '#00b894' },
  ]

  const processInput = () => {
    if (!input.trim() || isProcessing) return
    setIsProcessing(true)
    setCurrentStage(0)
    setLogs([`> Target: "${input}"`, 'Initializing agent pipeline...'])
    
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step >= stages.length) {
        clearInterval(interval)
        setIsProcessing(false)
        setCurrentStage(-1)
        setLogs(prev => [...prev, '✓ Task completed successfully. Waiting for next input...'])
        setInput('')
      } else {
        setCurrentStage(step)
        setLogs(prev => [...prev, `[${stages[step].label}] Processing data...`])
      }
    }, 1200)
  }

  return (
    <div
      ref={containerRef}
      className="space-y-3 rounded-lg border border-[#3cd0bd]/20 bg-[#0a1118]/50 p-4 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-[#64748b] text-xs">Interactive Agent Reasoning Pipeline</div>
      </div>
      
      {/* Interactive Input */}
      <div className="flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && processInput()}
          placeholder="Give the agent a task..."
          className="flex-1 bg-[#0f172a] border border-[#1e293b] rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#3cd0bd]/50"
          disabled={isProcessing}
        />
        <button 
          onClick={processInput}
          disabled={isProcessing || !input.trim()}
          className="px-3 py-1.5 bg-[#3cd0bd]/20 text-[#3cd0bd] rounded text-sm hover:bg-[#3cd0bd]/40 disabled:opacity-50 transition-colors"
        >
          {isProcessing ? 'Working...' : 'Execute'}
        </button>
      </div>

      {/* Nodes */}
      <div className="flex justify-between items-center py-4 relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[#1e293b] -z-10" />
        
        {stages.map((s, index) => (
          <div
            key={s.label}
            className={`relative flex flex-col items-center justify-center gap-2 transition-all duration-500 z-10 bg-[#0a1118] px-2 ${
              index === currentStage
                ? 'scale-125 opacity-100 drop-shadow-[0_0_8px_rgba(60,208,189,0.5)]'
                : index < currentStage
                ? 'opacity-70 scale-100'
                : 'opacity-30 scale-90 grayscale'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              index === currentStage ? 'border-[#3cd0bd] bg-[#3cd0bd]/20' : 'border-[#1e293b] bg-[#0f172a]'
            }`}>
              <span className="text-sm">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Output Console */}
      <div className="mt-2 h-24 bg-[#0f172a] rounded border border-[#1e293b] p-2 overflow-y-auto font-mono text-xs text-[#a1a1aa] flex flex-col gap-1">
        {logs.length === 0 ? (
          <span className="opacity-50">Log output will appear here...</span>
        ) : (
          logs.map((log, i) => (
            <span key={i} className={log.startsWith('>') ? 'text-[#3cd0bd]' : log.startsWith('✓') ? 'text-[#00b894]' : ''}>
              {log}
            </span>
          ))
        )}
      </div>
    </div>
  )
}

export function NeuralNetworkPulse() {
  const [activeNodes, setActiveNodes] = useState<{ layer: number; node: number }[]>([])

  const triggerNode = (layer: number, node: number) => {
    setActiveNodes(prev => [...prev, { layer, node }])
    
    // Auto-remove after 1s
    setTimeout(() => {
      setActiveNodes(prev => prev.filter(n => !(n.layer === layer && n.node === node)))
    }, 1000)

    // Fire next layer
    if (layer < 2) {
      setTimeout(() => {
        triggerNode(layer + 1, Math.floor(Math.random() * 5))
      }, 300)
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-[#3cd0bd]/20 bg-[#0a1118]/50 p-4 backdrop-blur-sm">
      <div className="text-[#64748b] text-xs mb-3">Interactive Network Layer (Click any node to forward-propagate)</div>
      <div className="flex justify-between items-center px-4 relative h-32">
        {/* SVG Lines between layers */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
          <path d="M 50 20 L 150 40 M 50 20 L 150 70 M 50 60 L 150 40 M 50 60 L 150 70 M 150 40 L 250 50 M 150 70 L 250 50" stroke="#3cd0bd" strokeWidth="1" />
        </svg>

        {[...Array(3)].map((_, layer) => (
          <div key={layer} className="flex flex-col gap-3 z-10">
            {[...Array(layer === 1 ? 6 : layer === 0 ? 4 : 5)].map((_, node) => {
              const isActive = activeNodes.some(n => n.layer === layer && n.node === node)
              return (
                <div
                  key={node}
                  onClick={() => triggerNode(layer, node)}
                  className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 relative border-2 ${
                    isActive
                      ? 'bg-[#3cd0bd] border-[#3cd0bd] scale-150 shadow-[0_0_15px_#3cd0bd]'
                      : 'bg-[#0f172a] border-[#1e293b] hover:border-[#3cd0bd]/50 hover:bg-[#3cd0bd]/20'
                  }`}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LLMAnimation() {
  return (
    <div className="space-y-4">
      <TokenStreamAnimation />
      <AgentThinkingAnimation />
      <NeuralNetworkPulse />
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

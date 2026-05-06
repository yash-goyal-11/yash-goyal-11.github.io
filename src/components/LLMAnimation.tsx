import { useEffect, useRef, useState } from 'react'
import { Brain, CheckCircle2, Play, Route, Search } from 'lucide-react'

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
  const logRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStage, setCurrentStage] = useState(-1)
  const [logs, setLogs] = useState<string[]>([])

  const stages = [
    { label: 'context_parsing', icon: Search, color: '#00b894' },
    { label: 'reasoning_loop', icon: Brain, color: '#a29bfe' },
    { label: 'action_planning', icon: Route, color: '#3cd0bd' },
    { label: 'execution', icon: Play, color: '#ffd93d' },
    { label: 'evaluation', icon: CheckCircle2, color: '#00b894' },
  ]

  const processInput = () => {
    if (!input.trim() || isProcessing) return
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsProcessing(true)
    setCurrentStage(0)
    setLogs([
      `> Target: "${input}"`,
      'Initializing agent pipeline...',
      `[${stages[0].label}] Context parsed.`,
    ])
    
    let step = 0
    intervalRef.current = setInterval(() => {
      step++
      if (step >= stages.length) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
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

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logs])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

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
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          <line x1="8%" y1="50%" x2="92%" y2="50%" stroke="rgba(60, 208, 189, 0.25)" strokeWidth="2" />
          {[18, 38, 58, 78].map((x) => (
            <line
              key={x}
              x1={`${x}%`}
              y1="50%"
              x2={`${x + 8}%`}
              y2="50%"
              stroke="rgba(60, 208, 189, 0.55)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
        </svg>
        
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
            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${
              index === currentStage ? 'border-[#3cd0bd] bg-[#3cd0bd]/20' : 'border-[#1e293b] bg-[#0f172a]'
            }`}>
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-[#94a3b8]">
              {s.label.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>

      {/* Output Console */}
      <div
        ref={logRef}
        className="mt-2 h-24 bg-[#0f172a] rounded border border-[#1e293b] p-2 overflow-y-auto font-mono text-xs text-[#a1a1aa] flex flex-col gap-1"
      >
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

  const layers = [
    { x: 40, nodes: 4 },
    { x: 140, nodes: 6 },
    { x: 240, nodes: 5 },
  ]
  const height = 140
  const yPadding = 12
  const layerPositions = layers.map((layer) => {
    const count = layer.nodes
    const gap = count > 1 ? (height - yPadding * 2) / (count - 1) : 0
    return Array.from({ length: count }, (_, index) => ({
      x: layer.x,
      y: yPadding + index * gap,
    }))
  })

  const connections = layerPositions[0].flatMap((pos, i) => {
    const targets = [i % layerPositions[1].length, (i + 2) % layerPositions[1].length]
    return targets.map((target) => ({
      from: pos,
      to: layerPositions[1][target],
    }))
  }).concat(
    layerPositions[1].flatMap((pos, i) => {
      const targets = [i % layerPositions[2].length, (i + 1) % layerPositions[2].length]
      return targets.map((target) => ({
        from: pos,
        to: layerPositions[2][target],
      }))
    })
  )

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
      <div className="relative h-36">
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          viewBox="0 0 280 140"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {connections.map((line, index) => (
            <line
              key={index}
              x1={line.from.x}
              y1={line.from.y}
              x2={line.to.x}
              y2={line.to.y}
              stroke="rgba(60, 208, 189, 0.4)"
              strokeWidth="1.5"
            />
          ))}
        </svg>

        {layerPositions.map((layer, layerIndex) => (
          <div key={layerIndex} className="absolute inset-0">
            {layer.map((pos, nodeIndex) => {
              const isActive = activeNodes.some(n => n.layer === layerIndex && n.node === nodeIndex)
              return (
                <div
                  key={`${layerIndex}-${nodeIndex}`}
                  onClick={() => triggerNode(layerIndex, nodeIndex)}
                  className={`absolute z-10 w-4 h-4 rounded-full cursor-pointer transition-all duration-300 border-2 ${
                    isActive
                      ? 'bg-[#3cd0bd] border-[#3cd0bd] scale-150 shadow-[0_0_15px_#3cd0bd]'
                      : 'bg-[#0f172a] border-[#1e293b] hover:border-[#3cd0bd]/50 hover:bg-[#3cd0bd]/20'
                  }`}
                  style={{
                    left: `${(pos.x / 280) * 100}%`,
                    top: `${(pos.y / 140) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
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

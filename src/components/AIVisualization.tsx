import { useEffect, useRef } from 'react'

export function AICapabilityBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#3cd0bd]/30 bg-[#3cd0bd]/10 backdrop-blur-sm">
      <span className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-[#3cd0bd] rounded-full animate-pulse" />
        <span className="w-1.5 h-1.5 bg-[#00b894] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
      </span>
      <span className="text-xs font-medium text-[#3cd0bd]">AI-Powered</span>
    </div>
  )
}

export function ModelVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 300
    canvas.height = 100

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw nodes
      const nodes = [
        { x: 30, y: 50, label: 'Input', color: '#3cd0bd' },
        { x: 100, y: 20, label: 'Hidden', color: '#a29bfe' },
        { x: 100, y: 50, label: 'Hidden', color: '#a29bfe' },
        { x: 100, y: 80, label: 'Hidden', color: '#a29bfe' },
        { x: 200, y: 35, label: 'Hidden', color: '#0984e3' },
        { x: 200, y: 65, label: 'Hidden', color: '#0984e3' },
        { x: 270, y: 50, label: 'Output', color: '#00b894' },
      ]

      // Draw connections with pulse effect
      nodes.forEach((node) => {
        nodes.forEach((otherNode) => {
          if (
            (node.x < otherNode.x && Math.abs(node.x - otherNode.x) <= 100) ||
            (node.x === otherNode.x && node.y < otherNode.y)
          ) {
            const pulse = (Math.sin(time * 0.005 + node.x + otherNode.y) + 1) / 2
            ctx.strokeStyle = `rgba(60, 208, 189, ${pulse * 0.3})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.stroke()
          }
        })
      })

      // Draw nodes
      nodes.forEach((node) => {
        const pulse = Math.sin(time * 0.003 + node.x) * 0.5 + 0.5
        ctx.fillStyle = node.color
        ctx.globalAlpha = 0.5 + pulse * 0.5
        ctx.beginPath()
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      })

      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [])

  return (
    <div className="rounded-lg border border-[#3cd0bd]/20 bg-[#0a1118]/50 p-4 backdrop-blur-sm">
      <div className="text-[#8b98ad] text-xs mb-3">Neural Network Visualization</div>
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ maxHeight: '100px' }}
      />
    </div>
  )
}

export function DataFlowAnimation() {
  return (
    <div className="space-y-2 rounded-lg border border-[#3cd0bd]/20 bg-[#0a1118]/50 p-4 backdrop-blur-sm">
      <div className="text-[#8b98ad] text-xs mb-3">Data Pipeline Flow</div>
      <div className="space-y-2">
        {[
          { label: 'Data Ingestion', icon: '📥' },
          { label: 'Processing', icon: '⚙️' },
          { label: 'Model Training', icon: '🧠' },
          { label: 'Inference', icon: '🚀' },
          { label: 'Monitoring', icon: '📊' },
        ].map((step, index) => (
          <div
            key={step.label}
            className="flex items-center gap-3 text-sm"
            style={{
              animation: `slideIn 2s ease-in-out infinite`,
              animationDelay: `${index * 0.3}s`,
            }}
          >
            <span>{step.icon}</span>
            <div className="flex-1 h-1 bg-gradient-to-r from-[#3cd0bd] to-transparent rounded-full" />
            <span className="text-[#8b98ad] text-xs">{step.label}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default function AIVisualization() {
  return (
    <div className="space-y-4">
      <ModelVisualization />
      <DataFlowAnimation />
    </div>
  )
}

'use client'

import ReactFlow, { MiniMap, Controls, Background, Node, Edge, NodeProps } from 'reactflow';
import 'reactflow/dist/style.css';
import { useCompletion } from '@/hooks/use-completion';
import { CheckCircle } from 'lucide-react';
import { QuestionModal } from './question-modal';
import { Question } from '@/lib/data';

interface QuestionMapProps {
  nodes: Node[];
  edges: Edge[];
  questions: Question[];
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500'
    case 'medium':
      return 'bg-yellow-500'
    case 'hard':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

const CustomNode = ({ data }: NodeProps) => {
    const { isCompleted, markAsComplete } = useCompletion();
    const completed = isCompleted(data.id);
  
    return (
      <div
        className={`p-2 rounded-md cursor-pointer transition-all duration-200 ${
          completed ? 'opacity-50' : ''
        } ${getDifficultyColor(data.difficulty)}`}
        style={{ color: 'white', border: '1px solid #222', width: 180 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold truncate">{data.label}</h3>
          {completed && <CheckCircle className="w-4 h-4 text-white" />}
        </div>
      </div>
    );
  };
  
const nodeTypes = {
    custom: CustomNode,
};

export default function QuestionMap({ nodes, edges, questions }: QuestionMapProps) {
  const { isCompleted, markAsComplete } = useCompletion();

  const nodesWithModals = nodes.map(node => {
    const question = questions.find(q => q.id === node.id);
    if (!question) return node;

    return {
        ...node,
        data: {
            ...node.data,
            label: (
                <QuestionModal 
                    question={question}
                    isCompleted={isCompleted(question.id)}
                    onMarkAsComplete={markAsComplete}
                >
                    <div>{question.title}</div>
                </QuestionModal>
            )
        }
    }
  })

  const edgesWithCompletion = edges.map(edge => ({
      ...edge,
      animated: isCompleted(edge.source) && !isCompleted(edge.target),
      style: { stroke: isCompleted(edge.source) ? '#34D399' : '#9CA3AF' }
  }))


  return (
    <div style={{ height: '800px' }}>
      <ReactFlow nodes={nodesWithModals} edges={edgesWithCompletion} nodeTypes={nodeTypes}>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  )
}

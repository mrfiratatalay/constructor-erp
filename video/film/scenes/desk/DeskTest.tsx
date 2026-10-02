import { DeskSet } from './DeskSet'

export const DeskTest: React.FC = () => (
  <DeskSet laptop={<div style={{ background: '#e8edf5', width: '100%', height: '100%' }} />}
    phone={<div style={{ background: '#1e293b', width: '100%', height: '100%' }} />} />
)

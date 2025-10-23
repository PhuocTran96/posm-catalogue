// Quick debug component to check data loading
import { useCatalogueIndex } from '@/hooks/useModelData';

export function DataDebug() {
  const { catalogue, loading, error } = useCatalogueIndex();
  
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px', border: '2px solid red' }}>
      <h2>DEBUG INFO</h2>
      <p>Loading: {loading ? 'YES' : 'NO'}</p>
      <p>Error: {error ? error.message : 'NONE'}</p>
      <p>Models count: {catalogue?.models?.length || 0}</p>
      <p>Categories count: {catalogue?.categories?.length || 0}</p>
      {catalogue?.models && (
        <pre>{JSON.stringify(catalogue.models.slice(0, 2), null, 2)}</pre>
      )}
    </div>
  );
}

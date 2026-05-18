export default function ClientDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Client Details</h1>
      <p>Viewing client ID: {params.id}</p>
    </div>
  );
}

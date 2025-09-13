export default function AdminTest() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Admin Test Page</h1>
      <p>This is a test page without any dependencies.</p>
      <ul>
        <li><a href="/admin/products">Admin Products</a></li>
        <li><a href="/">Home</a></li>
      </ul>
    </div>
  )
}
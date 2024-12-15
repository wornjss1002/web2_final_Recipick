export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">레시피를 찾을 수 없습니다</h2>
      <p className="text-gray-600">
        요청하신 레시피가 존재하지 않거나 삭제되었을 수 있습니다.
      </p>
    </div>
  )
}

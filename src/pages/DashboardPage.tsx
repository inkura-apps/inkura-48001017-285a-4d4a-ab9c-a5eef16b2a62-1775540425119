import ProjectsTable from '../components/tables/ProjectsTable'

interface DashboardPageProps {
  stats?: Partial<Record<string, number | string>>
}

export default function DashboardPage({ stats }: DashboardPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* stats */}
      <section className="py-12 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">{stats?.projectCount ?? '—'}</p>
            <p className="text-sm text-gray-500 mt-1">Total Projects</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">{stats?.activeTaskCount ?? '—'}</p>
            <p className="text-sm text-gray-500 mt-1">Active Tasks</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">{stats?.completedCount ?? '—'}</p>
            <p className="text-sm text-gray-500 mt-1">Completed</p>
          </div>
        </div>
      </section>

      {/* component: ProjectsTable */}
      <section className="py-6 px-6">
        <ProjectsTable />
      </section>

      {/* cta */}
      <section className="py-16 px-6 bg-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Create a new project</h2>
          <a href="/projects/new" className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors">New Project</a>
        </div>
      </section>
    </div>
  )
}

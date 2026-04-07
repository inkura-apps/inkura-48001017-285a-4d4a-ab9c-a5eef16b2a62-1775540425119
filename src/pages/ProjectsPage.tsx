import CreateProject from '../components/forms/CreateProject'
import ProjectsTable from '../components/tables/ProjectsTable'

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* component: CreateProject */}
      <section className="py-6 px-6">
        <CreateProject />
      </section>

      {/* component: ProjectsTable */}
      <section className="py-6 px-6">
        <ProjectsTable />
      </section>
    </div>
  )
}

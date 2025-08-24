import Navigation from "@/components/Navigation"


export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-0">{children}</div>
    </div>
  )
}

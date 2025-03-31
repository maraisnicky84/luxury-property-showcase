import { Home, Car, TreesIcon as Tree, Droplets, Users } from "lucide-react"

interface PropertyFeatureProps {
  icon: string
  label: string
}

export default function PropertyFeature({ icon, label }: PropertyFeatureProps) {
  const getIcon = () => {
    switch (icon) {
      case "home":
        return <Home className="w-5 h-5" />
      case "car":
        return <Car className="w-5 h-5" />
      case "tree":
        return <Tree className="w-5 h-5" />
      case "pool":
        return <Droplets className="w-5 h-5" />
      case "users":
        return <Users className="w-5 h-5" />
      default:
        return <Home className="w-5 h-5" />
    }
  }

  return (
    <div className="flex items-center gap-3 bg-primary/10 p-3 rounded-lg">
      <div className="bg-primary/20 p-2 rounded-full text-primary">{getIcon()}</div>
      <span className="text-foreground font-medium">{label}</span>
    </div>
  )
}


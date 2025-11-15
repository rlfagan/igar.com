import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink, Package, FileText, Scale, BookOpen, Info } from 'lucide-react'

interface ModelCardProps {
  modelMetadata: {
    name: string
    vendor?: string
    version?: string
    type?: string
    category?: string
    parameters?: string
    description?: string
    use_cases?: string
    license?: string
    documentation_url?: string
  }
  compact?: boolean
}

export function ModelCard({ modelMetadata, compact = false }: ModelCardProps) {
  if (!modelMetadata) {
    return null
  }

  const {
    name,
    vendor,
    version,
    type,
    category,
    parameters,
    description,
    use_cases,
    license,
    documentation_url,
  } = modelMetadata

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-900">
          <Package className="mr-2 w-5 h-5" />
          Model Card
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Model Name & Vendor */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Info className="w-4 h-4 mr-1" />
                Model Name
              </div>
              <p className="font-semibold text-lg">{name}</p>
              {version && <p className="text-sm text-gray-600 mt-0.5">Version: {version}</p>}
            </div>
            {vendor && (
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Package className="w-4 h-4 mr-1" />
                  Vendor
                </div>
                <p className="font-semibold text-lg">{vendor}</p>
                {category && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white">
                    {category}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Parameters/Size */}
          {parameters && (
            <div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <FileText className="w-4 h-4 mr-1" />
                Parameters/Size
              </div>
              <p className="font-medium">{parameters}</p>
            </div>
          )}

          {/* Description */}
          {description && !compact && (
            <div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <BookOpen className="w-4 h-4 mr-1" />
                Description
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
            </div>
          )}

          {/* Use Cases */}
          {use_cases && !compact && (
            <div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <FileText className="w-4 h-4 mr-1" />
                Common Use Cases
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{use_cases}</p>
            </div>
          )}

          {/* License & Documentation */}
          <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-blue-200">
            {license && (
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Scale className="w-4 h-4 mr-1" />
                  License
                </div>
                <p className="font-medium text-sm">{license}</p>
              </div>
            )}
            {documentation_url && (
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Documentation
                </div>
                <a
                  href={documentation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
                >
                  View Model Documentation
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            )}
          </div>

          {/* Type/Category Info */}
          {type && (
            <div className="text-xs text-gray-500 pt-2 border-t border-blue-200">
              Model Type: {type}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

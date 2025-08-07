
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

interface Document {
  id: number;
  name: string;
  date: string;
  size: string;
}

interface DocumentsListProps {
  documents: Document[];
}

const DocumentsList = ({ documents }: DocumentsListProps) => {
  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-red-400 to-red-600 rounded-lg">
                  <FileText className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-gray-500">Загружен: {doc.date} • {doc.size}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                Скачать
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentsList;

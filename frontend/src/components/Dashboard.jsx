import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { FileText, Upload, Search, LogOut, FolderPlus, Folder, Download, Trash2, Edit, MoreVertical, Tag, File, User } from "lucide-react";

export default function Dashboard({ user, onLogout }) {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");

  const [categoryName, setCategoryName] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editTags, setEditTags] = useState("");

  useEffect(() => {
    fetchDocuments();
    fetchCategories();
  }, [selectedCategory, searchQuery]);

  const fetchDocuments = async () => {
    try {
      const params = {};
      if (selectedCategory) params.category_id = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      
      const response = await axios.get(`${API}/documents`, { params });
      setDocuments(response.data);
    } catch (error) {
      toast.error("Gagal memuat dokumen");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      toast.error("Gagal memuat kategori");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Pilih file terlebih dahulu");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("category_id", categoryId);
    formData.append("tags", tags);

    try {
      await axios.post(`${API}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Dokumen berhasil diupload");
      setUploadOpen(false);
      setFile(null);
      setTitle("");
      setCategoryId("");
      setTags("");
      fetchDocuments();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Upload gagal");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/categories`, { name: categoryName });
      toast.success("Kategori berhasil dibuat");
      setCategoryOpen(false);
      setCategoryName("");
      fetchCategories();
    } catch (error) {
      toast.error("Gagal membuat kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Hapus kategori ini?")) return;

    try {
      await axios.delete(`${API}/categories/${id}`);
      toast.success("Kategori berhasil dihapus");
      fetchCategories();
      if (selectedCategory === id) setSelectedCategory(null);
    } catch (error) {
      toast.error("Gagal menghapus kategori");
    }
  };

  const handleEditDocument = (doc) => {
    setSelectedDoc(doc);
    setEditTitle(doc.title);
    setEditCategoryId(doc.category_id || "");
    setEditTags(doc.tags.join(", "));
    setEditOpen(true);
  };

  const handleUpdateDocument = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`${API}/documents/${selectedDoc.id}`, {
        title: editTitle,
        category_id: editCategoryId || null,
        tags: editTags.split(",").map(t => t.trim()).filter(t => t)
      });
      toast.success("Dokumen berhasil diupdate");
      setEditOpen(false);
      fetchDocuments();
    } catch (error) {
      toast.error("Gagal mengupdate dokumen");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm("Hapus dokumen ini?")) return;

    try {
      await axios.delete(`${API}/documents/${id}`);
      toast.success("Dokumen berhasil dihapus");
      fetchDocuments();
    } catch (error) {
      toast.error("Gagal menghapus dokumen");
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      const response = await axios.get(`${API}/documents/${id}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Download dimulai");
    } catch (error) {
      toast.error("Gagal mendownload dokumen");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  DocuFlow
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="font-medium">{user.username}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Dialog open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <FolderPlus className="w-4 h-4 mr-2" />
                        Kategori Baru
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Buat Kategori Baru</DialogTitle>
                        <DialogDescription>
                          Tambahkan kategori untuk mengorganisir dokumen Anda
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateCategory} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="categoryName">Nama Kategori</Label>
                          <Input
                            id="categoryName"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="Masukkan nama kategori"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? "Membuat..." : "Buat Kategori"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Kategori
                    </h3>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        !selectedCategory
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Folder className="w-4 h-4" />
                      <span className="flex-1 text-left text-sm font-medium">Semua Dokumen</span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                        {documents.length}
                      </span>
                    </button>

                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <button
                          onClick={() => setSelectedCategory(category.id)}
                          className="flex-1 flex items-center space-x-2 text-left"
                        >
                          <Folder className="w-4 h-4" />
                          <span className="text-sm font-medium">{category.name}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-1 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari dokumen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-6">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Dokumen
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Upload Dokumen Baru</DialogTitle>
                      <DialogDescription>
                        Upload file dokumen Anda dan atur informasinya
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpload} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="file">File</Label>
                        <Input
                          id="file"
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Judul Dokumen</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Masukkan judul dokumen"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Kategori (Opsional)</Label>
                        <select
                          id="category"
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        >
                          <option value="">Tanpa Kategori</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags (Opsional)</Label>
                        <Input
                          id="tags"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="tag1, tag2, tag3"
                        />
                        <p className="text-xs text-gray-500">Pisahkan dengan koma</p>
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Mengupload..." : "Upload"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {documents.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <File className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Belum ada dokumen
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Upload dokumen pertama Anda untuk memulai
                    </p>
                    <Button
                      onClick={() => setUploadOpen(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Dokumen
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg flex-shrink-0">
                              <File className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {doc.title}
                              </h3>
                              <p className="text-sm text-gray-500 truncate">
                                {doc.file_name}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDownload(doc.id, doc.file_name)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditDocument(doc)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between text-gray-600">
                            <span>Ukuran:</span>
                            <span className="font-medium">{formatFileSize(doc.file_size)}</span>
                          </div>
                          <div className="flex items-center justify-between text-gray-600">
                            <span>Diupload:</span>
                            <span className="font-medium text-xs">
                              {formatDate(doc.uploaded_at)}
                            </span>
                          </div>
                          {doc.tags && doc.tags.length > 0 && (
                            <div className="flex items-start space-x-2 pt-2">
                              <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div className="flex flex-wrap gap-1">
                                {doc.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Dokumen</DialogTitle>
            <DialogDescription>
              Update informasi dokumen Anda
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateDocument} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editTitle">Judul Dokumen</Label>
              <Input
                id="editTitle"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCategory">Kategori</Label>
              <select
                id="editCategory"
                value={editCategoryId}
                onChange={(e) => setEditCategoryId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">Tanpa Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editTags">Tags</Label>
              <Input
                id="editTags"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

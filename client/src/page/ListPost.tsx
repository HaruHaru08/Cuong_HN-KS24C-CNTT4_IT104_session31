// import React from 'react'
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Table } from "react-bootstrap";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  image: string;
  date: string;
  content: string;
  status: boolean;
}

export default function ListPost() {
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [post, setPost] = useState<Post>({
    id: posts.length + 1,
    title: "",
    image: "",
    date: `${new Date().getDate()}/${new Date().getMonth() + 1}`,
    content: "",
    status: true,
  });
  const [edit, setEdit] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [search, setSearch] = useState<string>("");
  async function getAllPost() {
    try {
      const res = await axios.get("http://localhost:8080/posts");
      setPosts(res.data);
    } catch (error) {}
  }
  const [selectStatus, setSelectStatus] = useState("");
  const resetForm = () => {
    setPost({
      id: 0,
      title: "",
      image: "",
      date: `${new Date().getDate()}/${new Date().getMonth() + 1}`,
      content: "",
      status: true,
    });
    setEdit(false);
    setCurrentId(null);
  };

  const handleClose = () => {
    setShow(false);
    resetForm();
  };

  const handleShow = () => {
    resetForm();
    setShow(true);
  };

  const handleSave = async () => {
    try {
      if (!post.title.trim() || !post.image.trim() || !post.content.trim()) {
        alert("Tên bài viết, hình ảnh và nội dung không được bỏ trống");
        return;
      }
      const duplicate = posts.some(
        (item) =>
          item.title.trim().toLowerCase() === post.title.trim().toLowerCase()
      );
      if (duplicate) {
        alert("Tên bài viết đã tồn tại");
        return;
      }
      const response = await axios.post("http://localhost:8080/posts", {
        ...post,
      });
      setPosts([...posts, response.data]);
      handleClose();
    } catch (error) {}
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  async function editStatusPost(id: number, currentStatus: boolean) {
    try {
      const response = await axios.patch(`http://localhost:8080/posts/${id}`, {
        status: !currentStatus,
      });
      setPosts(posts.map((post) => (post.id === id ? response.data : post)));
    } catch (error) {}
  }

  const handleDelete = async (id: number) => {
    try {
      const comfirmDelete = confirm("Bạn có chắc muốn xóa bài viết này không?");
      if (comfirmDelete) {
        await axios.delete(`http://localhost:8080/posts/${id}`);
        setPosts((item) => item.filter((item) => item.id !== id));
      }
    } catch (error) {}
  };

  const handleEditShow = (item: Post) => {
    setEdit(true);
    setCurrentId(item.id);
    setPost(item);
    setShow(true);
  };

  const handleUpdate = async () => {
    if (!post.title.trim() || !post.image.trim() || !post.content.trim()) {
      alert("Tên bài viết, hình ảnh và nội dung không được bỏ trống");
      return;
    }
    const duplicate = posts.some(
      (item) =>
        item.id !== currentId &&
        item.title.trim().toLowerCase() === post.title.trim().toLowerCase()
    );
    if (duplicate) {
      alert("Tên bài viết đã tồn tại");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8080/posts/${currentId}`,
        post
      );
      setPosts(
        posts.map((item) => (item.id === currentId ? response.data : item))
      );
      handleClose();
    } catch (error) {}
  };
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const keySearch = e.target.value;
    setSearch(keySearch);
    try {
      const response = await axios.get(
        `http://localhost:8080/posts?title_like=${keySearch}`
      );
      setPosts(response.data);
    } catch (error) {}
  };
  const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectStatus(value);
    try {
      if (value === "") {
        getAllPost();
      } else {
        const response = await axios.get(
          `http://localhost:8080/posts?status=${
            value === "Da xuat ban" ? true : false
          }`
        );
        setPosts(response.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getAllPost();
  }, []);

  return (
    <div>
      <h1>Danh sách Bài viết</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "10px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Nhập từ khóa tìm kiếm"
            style={{ borderRadius: "5px", height: "30px", width: "300px" }}
            value={search}
            onChange={handleSearch}
          />
          <select
            style={{ borderRadius: "5px", height: "30px", width: "300px" }}
            value={selectStatus}
            onChange={handleSelect}
          >
            <option value="">Lựa chọn</option>
            <option value="Da xuat ban">Đã xuất bản</option>
            <option value="Chua Xuat ban">Chưa xuất bản</option>
          </select>
        </div>
        <Button
          variant="primary"
          onClick={handleShow}
          style={{ marginRight: "10px" }}
        >
          Thêm bài viết
        </Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {edit ? "Cập nhật bài viết" : "Thêm bài viết mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên bài viết</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                name="title"
                value={post.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={post.image}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nội dung bài viết</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="content"
                value={post.content}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          {edit ? (
            <Button variant="primary" onClick={handleUpdate}>
              Cập nhật
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSave}>
              Lưu bài viết
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Table striped bordered hover style={{ textAlign: "center" }}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tiêu đề</th>
            <th>Hình ảnh</th>
            <th>Ngày viết</th>
            <th>Trạng thái</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {posts &&
            posts.map((item: Post) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>
                  <img
                    src={item.image}
                    alt=""
                    style={{
                      borderRadius: "100%",
                      width: "40px",
                      objectFit: "cover",
                      height: "40px",
                    }}
                  />
                </td>
                <td>{item.date}</td>
                <td>
                  <span
                    style={{
                      backgroundColor: item.status ? "#f6ffed" : "#fff2f0",
                      color: item.status ? "#75b181" : "#d97287",
                      border: item.status ? "#c6f0a5" : "#ffa6a1",
                      height: "40px",
                    }}
                  >
                    {item.status ? "Đã xuất bản" : "Chưa xuất bản"}
                  </span>
                </td>
                <td
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    height: "60px",
                  }}
                >
                  <button
                    style={{
                      border: "none",
                      backgroundColor: "#faad14",
                      borderRadius: "5px",
                      color: "#fcedcf",
                      width: "80px",
                    }}
                    onClick={() => editStatusPost(item.id, item.status)}
                  >
                    {item.status ? "Chặn" : "Bỏ Chặn"}
                  </button>
                  <button
                    style={{
                      border: "1px solid #ffd797",
                      backgroundColor: "#fff7e6",
                      borderRadius: "5px",
                      color: "#da835e",
                      width: "60px",
                    }}
                    onClick={() => handleEditShow(item)}
                  >
                    Sửa
                  </button>
                  <button
                    style={{
                      border: "1px solid #ffa8a3",
                      backgroundColor: "#fff1f0",
                      borderRadius: "5px",
                      color: "#d63b59",
                      width: "60px",
                    }}
                    onClick={() => handleDelete(item.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}

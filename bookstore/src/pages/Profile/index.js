"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Card from "../../components/ui/Card";
import { User, Mail, Phone, Lock, Edit, Save, X } from "lucide-react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const Profile = () => {
  const { isAuthenticated, userInfo, user } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [activeTab, setActiveTab] = useState("profile");

  // Chuyển hướng nếu chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Lấy thông tin profile và đánh giá của người dùng
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        console.log("Fetching user profile data...");
        const profileData = await userService.getCurrentUserProfile();
        console.log("Profile data received:", profileData);
        setProfile(profileData);
        setFormData({
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          phoneNumber: profileData.phoneNumber || "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);

        // Create a more user-friendly error message
        let errorMessage = "Không thể tải thông tin người dùng. ";

        if (err.response?.status === 403) {
          errorMessage =
            "Không có quyền truy cập thông tin người dùng. Lỗi 403.";
        } else if (err.message) {
          errorMessage += err.message;
        }

        setError(errorMessage);

        // Create a fallback profile from Redux store
        const email = user?.email || userInfo?.email || "user@example.com";
        const role = user?.role || userInfo?.role || "customer";

        const basicProfile = {
          firstName: "",
          lastName: "",
          email: email,
          phoneNumber: "",
          roleName: role,
        };

        setProfile(basicProfile);
        setFormData({
          firstName: "",
          lastName: "",
          phoneNumber: "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, userInfo, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user types
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "Tên là bắt buộc";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Họ là bắt buộc";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Mật khẩu hiện tại là bắt buộc";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "Mật khẩu mới là bắt buộc";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setLoading(true);
        const updatedProfile = await userService.updateCurrentUserProfile(
          formData
        );
        setProfile(updatedProfile);
        setSuccess("Cập nhật thông tin thành công!");
        setIsEditing(false);
      } catch (err) {
        setError("Không thể cập nhật thông tin. Vui lòng thử lại sau.");
        console.error("Error updating profile:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (validatePasswordForm()) {
      try {
        setLoading(true);
        await userService.changePassword(passwordData);
        setPasswordSuccess("Đổi mật khẩu thành công!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        setPasswordErrors({
          form: "Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.",
        });
        console.error("Error changing password:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      phoneNumber: profile.phoneNumber || "",
    });
    setFormErrors({});
    setIsEditing(false);
  };

  if (loading && !profile) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Hồ sơ người dùng
      </h1>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
          className="mb-6"
        />
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <Card className="mb-6">
            <Card.Body>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <p className="text-gray-600">{profile?.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {profile?.roleName}
                </p>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body className="p-0">
              <ul className="divide-y divide-gray-200">
                <li>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full text-left px-4 py-3 ${
                      activeTab === "profile"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Thông tin cá nhân
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full text-left px-4 py-3 ${
                      activeTab === "security"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Bảo mật
                  </button>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {activeTab === "profile" && (
            <Card>
              <Card.Header className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Thông tin cá nhân</h3>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Hủy
                    </Button>
                    <Button size="sm" onClick={handleSubmit} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu
                    </Button>
                  </div>
                )}
              </Card.Header>
              <Card.Body>
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Input
                          label="Tên"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          error={formErrors.firstName}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          label="Họ"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          error={formErrors.lastName}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Input
                        label="Số điện thoại"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        error={formErrors.phoneNumber}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-gray-500">
                        {profile?.email}{" "}
                        <span className="text-xs text-gray-400">
                          (Không thể thay đổi)
                        </span>
                      </p>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Họ và tên</p>
                        <p className="font-medium">
                          {profile?.firstName} {profile?.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profile?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium">
                          {profile?.phoneNumber || "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-medium">Bảo mật</h3>
              </Card.Header>
              <Card.Body>
                <div className="mb-6">
                  <h4 className="text-md font-medium mb-4">Đổi mật khẩu</h4>

                  {passwordSuccess && (
                    <Alert
                      type="success"
                      message={passwordSuccess}
                      onClose={() => setPasswordSuccess(null)}
                      className="mb-4"
                    />
                  )}

                  {passwordErrors.form && (
                    <Alert
                      type="error"
                      message={passwordErrors.form}
                      onClose={() =>
                        setPasswordErrors((prev) => ({ ...prev, form: null }))
                      }
                      className="mb-4"
                    />
                  )}

                  <form onSubmit={handlePasswordSubmit}>
                    <div className="mb-4">
                      <Input
                        label="Mật khẩu hiện tại"
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        error={passwordErrors.currentPassword}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <Input
                        label="Mật khẩu mới"
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        error={passwordErrors.newPassword}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <Input
                        label="Xác nhận mật khẩu mới"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        error={passwordErrors.confirmPassword}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      <Lock className="h-4 w-4 mr-2" />
                      Đổi mật khẩu
                    </Button>
                  </form>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

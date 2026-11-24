import { useState } from "react";
import { ThemeProvider, ThemeToggle, useTheme } from "../../components/ui/ThemeProvider";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
  Badge,
  Input,
  Textarea,
  FileUpload,
  Modal,
  Drawer,
  Toast,
  ToastContainer,
  Table,
  Avatar,
  Icon,
} from "../../components/ui";
import { Icons } from "../../components/ui/Icon";
import type { BadgeVariant } from "../../components/ui/Badge";

/* ============================================================================
   DESIGN SHOWCASE PAGE
   Renders every component in all variants/sizes in both themes
   ============================================================================ */

function DesignContent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; variant: "success" | "error" | "warning" | "info"; title: string; description?: string; action?: React.ReactNode }>>([]);

  const addToast = (variant: "success" | "error" | "warning" | "info", title: string, description?: string, action?: React.ReactNode) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, variant, title, description, action }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="design-showcase">
      {/* Top Bar */}
      <header className="design-showcase__topbar">
        <div className="design-showcase__brand">
          <Icon name={Icons.Home} size="xl" />
          <h1 className="design-showcase__title">Oristoria Design System</h1>
        </div>
        <div className="design-showcase__controls">
          <ThemeToggle />
          <div className="design-showcase__theme-indicator" data-theme={theme}>
            {theme === "light" ? "☀️ Light" : "🌙 Dark"}
          </div>
        </div>
      </header>

      <main className="design-showcase__main">
        {/* Buttons Section */}
        <section className="design-showcase__section" aria-labelledby="buttons-heading">
          <header className="design-showcase__section-header">
            <h2 id="buttons-heading" className="design-showcase__section-title">Buttons</h2>
            <p className="design-showcase__section-desc">All variants, sizes, and states per DESIGN.md §6</p>
          </header>

          <div className="design-showcase__grid">
            {/* Variants */}
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Variants</h3>
              <div className="design-showcase__button-group">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="destructive-filled">Destructive Filled</Button>
              </div>
            </div>

            {/* Sizes */}
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Sizes</h3>
              <div className="design-showcase__button-group">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* With Icons */}
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">With Icons</h3>
              <div className="design-showcase__button-group">
                <Button icon={<Icon name={Icons.Upload} size="sm" />} iconPosition="start">
                  Upload
                </Button>
                <Button variant="secondary" icon={<Icon name={Icons.Download} size="sm" />} iconPosition="end">
                  Download
                </Button>
                <Button variant="ghost" icon={<Icon name={Icons.Plus} size="sm" />} iconPosition="start">
                  Add
                </Button>
              </div>
            </div>

            {/* States */}
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">States</h3>
              <div className="design-showcase__button-group">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="design-showcase__section" aria-labelledby="cards-heading">
          <header className="design-showcase__section-header">
            <h2 id="cards-heading" className="design-showcase__section-title">Cards</h2>
            <p className="design-showcase__section-desc">Base card + Source, Artifact, Run Step, Citation, Empty variants per DESIGN.md §6</p>
          </header>

          <div className="design-showcase__grid">
            {/* Base Cards */}
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Base Variants</h3>
              <div className="design-showcase__card-group">
                <Card padding="md">
                  <CardHeader>
                    <CardTitle>Default Card</CardTitle>
                    <CardDescription>Standard card with header and content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This is the base card component with paper-elevated background, subtle border, and sm shadow.</p>
                  </CardContent>
                  <CardFooter>
                    <CardAction variant="ghost">Cancel</CardAction>
                    <CardAction variant="primary">Confirm</CardAction>
                  </CardFooter>
                </Card>

                <Card variant="error" padding="md">
                  <CardHeader>
                    <CardTitle>Error Card</CardTitle>
                    <CardDescription>Error state with red left border</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Something went wrong. Please try again or contact support.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Interactive States */}
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Interactive States</h3>
              <div className="design-showcase__card-group">
                <Card hoverable padding="md">
                  <CardHeader>
                    <CardTitle>Hoverable Card</CardTitle>
                    <CardDescription>Hover to see elevation change</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This card elevates on hover with md shadow and emphasis border.</p>
                  </CardContent>
                </Card>

                <Card selected padding="md">
                  <CardHeader>
                    <CardTitle>Selected Card</CardTitle>
                    <CardDescription>Selected state with accent left border</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Selected cards show accent-terracotta-subtle background and 2px left border.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Source Card */}
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Source Card</h3>
              <Card variant="source" padding="md">
                <div className="card__thumbnail" style={{ background: "linear-gradient(135deg, var(--color-accent-terracotta-subtle), var(--color-paper-hover))" }} />
                <CardHeader>
                  <CardTitle>Research Paper.pdf</CardTitle>
                  <CardDescription>Uploaded 2 hours ago • 42 pages</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="ready">Ready</Badge>
                </CardContent>
                <CardFooter>
                  <CardAction variant="ghost" data-testid="overflow-menu">
                    <Icon name={Icons.MoreVertical} size="sm" />
                  </CardAction>
                </CardFooter>
              </Card>
            </div>

            {/* Artifact Card */}
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Artifact Card</h3>
              <Card variant="artifact" padding="md">
                <CardHeader>
                  <div className="card__icon" aria-hidden="true">📄</div>
                  <div className="card__header-row">
                    <CardTitle>Research Brief: AI Safety</CardTitle>
                    <Badge variant="info">research_brief</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>Generated from run #123 • 3 minutes ago</CardDescription>
                </CardContent>
                <CardFooter>
                  <CardAction variant="ghost">View run</CardAction>
                  <CardAction variant="primary">Preview</CardAction>
                </CardFooter>
              </Card>
            </div>

            {/* Run Step Card */}
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Run Step Card</h3>
              <Card variant="run-step" padding="md">
                <CardHeader>
                  <div className="card__icon" aria-hidden="true">🔍</div>
                  <CardTitle>Gather Evidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="card__meta">
                    <Badge variant="ready">Completed</Badge>
                    <span>2.3s</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <CardAction variant="ghost">
                    <Icon name={Icons.ChevronDown} size="sm" />
                  </CardAction>
                </CardFooter>
              </Card>
            </div>

            {/* Citation Card */}
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Citation Card</h3>
              <Card variant="citation" padding="md">
                <CardHeader>
                  <CardTitle>Source Document.pdf</CardTitle>
                  <CardDescription>Page 5</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This is the cited passage from the document that supports the claim being made in the answer...</p>
                </CardContent>
                <CardFooter>
                  <Badge variant="success">Verified</Badge>
                  <CardAction variant="ghost">Open</CardAction>
                </CardFooter>
              </Card>
            </div>

            {/* Empty State */}
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Empty State</h3>
              <Card variant="empty" padding="lg">
                <CardHeader>
                  <CardTitle>No sources yet</CardTitle>
                  <CardDescription>Upload your first document to get started</CardDescription>
                </CardHeader>
                <CardFooter>
                  <CardAction variant="primary">Upload</CardAction>
                </CardFooter>
              </Card>
            </div>

            {/* Loading State */}
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Loading State</h3>
              <Card loading padding="md" style={{ minHeight: "120px" }}>
                <CardHeader>
                  <CardTitle>Loading...</CardTitle>
                  <CardDescription>Content will appear here</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Skeleton preserves dimensions while loading.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section className="design-showcase__section" aria-labelledby="badges-heading">
          <header className="design-showcase__section-header">
            <h2 id="badges-heading" className="design-showcase__section-title">Badges</h2>
            <p className="design-showcase__section-desc">Status badges per DESIGN.md §6</p>
          </header>

          <div className="design-showcase__grid">
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Status Variants</h3>
              <div className="design-showcase__badge-group">
                <Badge variant="processing">Processing</Badge>
                <Badge variant="queued">Queued</Badge>
                <Badge variant="ready">Ready</Badge>
                <Badge variant="failed">Failed</Badge>
              </div>
            </div>

            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Semantic Variants</h3>
              <div className="design-showcase__badge-group">
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="default">Default</Badge>
              </div>
            </div>

            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">With Icons</h3>
              <div className="design-showcase__badge-group">
                <Badge variant="success" icon={<Icon name={Icons.CheckCircle2} size="xs" />}>Verified</Badge>
                <Badge variant="error" icon={<Icon name={Icons.Flag} size="xs" />}>Unsupported</Badge>
                <Badge variant="warning" icon={<Icon name={Icons.AlertTriangle} size="xs" />}>Pending</Badge>
              </div>
            </div>

            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Small Size</h3>
              <div className="design-showcase__badge-group">
                <Badge variant="ready" size="sm">Ready</Badge>
                <Badge variant="processing" size="sm">Processing</Badge>
                <Badge variant="failed" size="sm">Failed</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="design-showcase__section" aria-labelledby="inputs-heading">
          <header className="design-showcase__section-header">
            <h2 id="inputs-heading" className="design-showcase__section-title">Inputs & Forms</h2>
            <p className="design-showcase__section-desc">Input, Textarea, and File Upload zone per DESIGN.md §6</p>
          </header>

          <div className="design-showcase__grid">
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Input States</h3>
              <div className="design-showcase__form-group">
                <Input label="Default Input" placeholder="Enter text..." />
                <Input label="With Helper" helperText="This is helper text" placeholder="Enter text..." />
                <Input label="Error State" error="This field is required" placeholder="Enter text..." />
                <Input label="Disabled" disabled placeholder="Cannot edit" />
              </div>
            </div>

            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">With Icons</h3>
              <div className="design-showcase__form-group">
                <Input
                  label="Search"
                  placeholder="Search..."
                  leadingIcon={<Icon name={Icons.Search} size="sm" />}
                />
                <Input
                  label="Amount"
                  placeholder="0.00"
                  trailingIcon={<Icon name={Icons.DollarSign} size="sm" />}
                  type="number"
                />
              </div>
            </div>

            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Textarea</h3>
              <div className="design-showcase__form-group">
                <Textarea
                  label="Description"
                  placeholder="Enter a longer description..."
                  rows={4}
                />
                <Textarea
                  label="With Error"
                  error="Description is too long"
                  placeholder="Enter description..."
                  rows={3}
                />
              </div>
            </div>

            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">File Upload Zone</h3>
              <FileUpload
                label="Upload Document"
                accept=".pdf,.docx,.txt"
                maxSize={10 * 1024 * 1024}
                onFilesSelect={(files) => console.log("Selected:", files.map(f => f.name))}
                helperText="PDF, DOCX, or TXT up to 10MB"
              />
            </div>
          </div>
        </section>

        {/* Modals & Drawers Section */}
        <section className="design-showcase__section" aria-labelledby="overlays-heading">
          <header className="design-showcase__section-header">
            <h2 id="overlays-heading" className="design-showcase__section-title">Modals & Drawers</h2>
            <p className="design-showcase__section-desc">Modal (centered) and Drawer (slide-over) per DESIGN.md §6</p>
          </header>

          <div className="design-showcase__grid">
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Modal</h3>
              <div className="design-showcase__button-group">
                <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              </div>
            </div>

            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Drawer</h3>
              <div className="design-showcase__button-group">
                <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
              </div>
            </div>
          </div>

          {/* Modal */}
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Confirm Action"
            description="Are you sure you want to proceed? This action cannot be undone."
            size="md"
            footer={
              <>
                <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={() => setModalOpen(false)}>Delete</Button>
              </>
            }
          >
            <p>This is a modal dialog with a title, description, and action buttons. The focus is trapped within the modal.</p>
          </Modal>

          {/* Drawer */}
          <Drawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Source Details"
            description="View and manage your uploaded source document"
            position="right"
          >
            <div style={{ padding: "var(--space-4)" }}>
              <h3 style={{ margin: "0 0 var(--space-4)" }}>Document Information</h3>
              <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "var(--space-2) var(--space-4)" }}>
                <dt>Title</dt><dd>Research Paper.pdf</dd>
                <dt>Pages</dt><dd>42</dd>
                <dt>Status</dt><dd><Badge variant="ready">Ready</Badge></dd>
                <dt>Uploaded</dt><dd>2 hours ago</dd>
                <dt>Size</dt><dd>2.4 MB</dd>
              </dl>
              <div style={{ marginTop: "var(--space-6)", display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary">Open Document</Button>
              </div>
            </div>
          </Drawer>
        </section>

        {/* Toasts Section */}
        <section className="design-showcase__section" aria-labelledby="toasts-heading">
          <header className="design-showcase__section-header">
            <h2 id="toasts-heading" className="design-showcase__section-title">Toasts</h2>
            <p className="design-showcase__section-desc">Notification toasts per DESIGN.md §6</p>
          </header>

          <div className="design-showcase__grid">
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Toast Variants</h3>
              <div className="design-showcase__button-group">
                <Button onClick={() => addToast("success", "Success!", "Your changes have been saved.")}>
                  Success
                </Button>
                <Button variant="secondary" onClick={() => addToast("error", "Error!", "Something went wrong. Please try again.")}>
                  Error
                </Button>
                <Button variant="ghost" onClick={() => addToast("warning", "Warning", "You're approaching your usage limit.")}>
                  Warning
                </Button>
                <Button variant="destructive" onClick={() => addToast("info", "Info", "New version available. Refresh to update.")}>
                  Info
                </Button>
              </div>
            </div>

            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">With Action</h3>
              <Button
                onClick={() => addToast("success", "File uploaded", "Research Paper.pdf", <Button size="sm" variant="ghost">View</Button>)}
              >
                Toast with Action
              </Button>
            </div>
          </div>

          {/* Toast Container */}
          <ToastContainer toasts={toasts} onClose={removeToast} />
        </section>

        {/* Table Section */}
        <section className="design-showcase__section" aria-labelledby="tables-heading">
          <header className="design-showcase__section-header">
            <h2 id="tables-heading" className="design-showcase__section-title">Tables</h2>
            <p className="design-showcase__section-desc">Data table with sorting, selection, responsive card stack per DESIGN.md §6</p>
          </header>

          <div className="design-showcase__demo">
            <Table
              caption="Recent Sources"
              columns={[
                { key: "name", header: "Name", render: (row) => <strong>{row.name}</strong> },
                { key: "type", header: "Type" },
                { key: "pages", header: "Pages", align: "right" },
                { key: "status", header: "Status", render: (row) => <Badge variant={row.status as BadgeVariant}>{row.status}</Badge> },
                { key: "date", header: "Uploaded" },
              ]}
              data={[
                { id: "1", name: "Research Paper.pdf", type: "PDF", pages: 42, status: "ready", date: "2 hours ago" },
                { id: "2", name: "Meeting Notes.docx", type: "DOCX", pages: 8, status: "processing", date: "1 hour ago" },
                { id: "3", name: "Data Export.csv", type: "CSV", pages: 1, status: "ready", date: "3 days ago" },
                { id: "4", name: "Scanned Doc.pdf", type: "PDF", pages: 15, status: "failed", date: "1 week ago" },
              ]}
              keyExtractor={(row) => row.id}
              selectable
              onRowClick={(row) => console.log("Row clicked:", row)}
            />
          </div>
        </section>

        {/* Avatars Section */}
        <section className="design-showcase__section" aria-labelledby="avatars-heading">
          <header className="design-showcase__section-header">
            <h2 id="avatars-heading" className="design-showcase__section-title">Avatars</h2>
            <p className="design-showcase__section-desc">User avatars with image, initials fallback, and sizes per DESIGN.md §6</p>
          </header>

          <div className="design-showcase__grid">
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Sizes</h3>
              <div className="design-showcase__avatar-group">
                <Avatar name="Alex Chen" size="xs" />
                <Avatar name="Alex Chen" size="sm" />
                <Avatar name="Alex Chen" size="md" />
                <Avatar name="Alex Chen" size="lg" />
                <Avatar name="Alex Chen" size="xl" />
              </div>
            </div>

            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">With Images</h3>
              <div className="design-showcase__avatar-group">
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=alex" alt="Alex Chen" size="md" />
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=jordan" alt="Jordan Kim" size="md" />
                <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=taylor" alt="Taylor Smith" size="md" />
              </div>
            </div>

            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Shapes</h3>
              <div className="design-showcase__avatar-group">
                <Avatar name="Alex Chen" size="md" shape="circle" />
                <Avatar name="Alex Chen" size="md" shape="square" />
              </div>
            </div>

            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Fallback</h3>
              <div className="design-showcase__avatar-group">
                <Avatar name="A" size="md" />
                <Avatar name="J K" size="md" />
                <Avatar size="md" fallback={<Icon name={Icons.User} size="md" />} />
              </div>
            </div>
          </div>
        </section>

        {/* Icons Section */}
        <section className="design-showcase__section" aria-labelledby="icons-heading">
          <header className="design-showcase__section-header">
            <h2 id="icons-heading" className="design-showcase__section-title">Icons</h2>
            <p className="design-showcase__section-desc">Lucide icons with design token sizing and colors per DESIGN.md §7</p>
          </header>

          <div className="design-showcase__grid">
            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Sizes</h3>
              <div className="design-showcase__icon-group">
                <Icon name={Icons.Settings} size="xs" />
                <Icon name={Icons.Settings} size="sm" />
                <Icon name={Icons.Settings} size="md" />
                <Icon name={Icons.Settings} size="lg" />
                <Icon name={Icons.Settings} size="xl" />
                <Icon name={Icons.Settings} size="2xl" />
              </div>
            </div>

            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Colors</h3>
              <div className="design-showcase__icon-group">
                <Icon name={Icons.Settings} size="lg" color="default" />
                <Icon name={Icons.Settings} size="lg" color="muted" />
                <Icon name={Icons.Settings} size="lg" color="accent" />
                <Icon name={Icons.Settings} size="lg" color="success" />
                <Icon name={Icons.Settings} size="lg" color="error" />
                <Icon name={Icons.Settings} size="lg" color="inverse" />
              </div>
            </div>

            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Navigation Icons</h3>
              <div className="design-showcase__icon-group">
                <Icon name={Icons.FolderOpen} size="lg" />
                <Icon name={Icons.MessageSquare} size="lg" />
                <Icon name={Icons.FileText} size="lg" />
                <Icon name={Icons.GitBranch} size="lg" />
                <Icon name={Icons.Settings} size="lg" />
              </div>
            </div>

            <div className="design-showcase__demo">
              <h3 className="design-showcase__demo-title">Action Icons</h3>
              <div className="design-showcase__icon-group">
                <Icon name={Icons.Upload} size="lg" />
                <Icon name={Icons.Download} size="lg" />
                <Icon name={Icons.Trash2} size="lg" />
                <Icon name={Icons.Edit2} size="lg" />
                <Icon name={Icons.Copy} size="lg" />
                <Icon name={Icons.Share2} size="lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Theme Toggle Demo */}
        <section className="design-showcase__section" aria-labelledby="theme-heading">
          <header className="design-showcase__section-header">
            <h2 id="theme-heading" className="design-showcase__section-title">Theme Switching</h2>
            <p className="design-showcase__section-desc">Instant light/dark theme swap with localStorage persistence</p>
          </header>

          <div className="design-showcase__demo">
            <div className="design-showcase__theme-demo">
              <div className="design-showcase__theme-preview" data-theme="light">
                <div className="design-showcase__theme-card">
                  <h4>Light Theme</h4>
                  <p>Current: {theme === "light" ? "✓ Active" : "Inactive"}</p>
                </div>
              </div>
              <div className="design-showcase__theme-preview" data-theme="dark">
                <div className="design-showcase__theme-card" style={{ background: "var(--color-paper-elevated)", borderColor: "var(--color-border-subtle)" }}>
                  <h4>Dark Theme</h4>
                  <p>Current: {theme === "dark" ? "✓ Active" : "Inactive"}</p>
                </div>
              </div>
            </div>
            <div className="design-showcase__button-group">
              <Button onClick={() => setTheme("light")} variant={theme === "light" ? "primary" : "secondary"}>Light</Button>
              <Button onClick={() => setTheme("dark")} variant={theme === "dark" ? "primary" : "secondary"}>Dark</Button>
              <Button onClick={toggleTheme} variant="ghost">Toggle</Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="design-showcase__footer">
        <p>Oristoria Design System • Built with React 19 + TypeScript + Vite</p>
        <p className="design-showcase__footer-note">All components use CSS variables from DESIGN.md tokens. No hardcoded colors.</p>
      </footer>
    </div>
  );
}

export default function DesignShowcase() {
  return (
    <ThemeProvider defaultTheme="system">
      <DesignContent />
    </ThemeProvider>
  );
}
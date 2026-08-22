const ShowOnDesktop = ({ children }: { children: React.ReactNode }) => (
  <div className="hidden lg:block">{children}</div>
)

export default ShowOnDesktop

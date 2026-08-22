const ShowOnMobile = ({ children }: { children: React.ReactNode }) => (
  <div className="lg:hidden">{children}</div>
)

export default ShowOnMobile
